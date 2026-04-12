"""
MCP Server: Places (OpenStreetMap)
Runs as a standalone MCP process via stdio transport.
The orchestrator connects to this as an MCP client.
"""

import asyncio
import sys
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("places")

from utils import get_coordinates, execute_overpass_query


@mcp.tool()
async def search_places(query: str, location: str) -> dict:
    """
    Search for tourist attractions, temples, museums, or landmarks near a city.
    Args:
        query: Category to search, e.g. 'temples', 'museums', 'parks'
        location: City name, e.g. 'Tokyo'
    """
    lat, lon = await get_coordinates(location)
    if not lat:
        return {"error": f"Could not find location: {location}"}

    # Search a much wider radius (10km) and include many more categories
    oq = f"""
    [out:json][timeout:30];
    (
      node["tourism"~"museum|attraction|viewpoint|gallery|theme_park|zoo"](around:10000,{lat},{lon});
      way["tourism"~"museum|attraction|viewpoint|gallery|theme_park|zoo"](around:10000,{lat},{lon});
      relation["tourism"~"museum|attraction|viewpoint|gallery|theme_park|zoo"](around:10000,{lat},{lon});
      node["historic"~"monument|memorial|castle|ruins|fort|archaeological_site|temple"](around:10000,{lat},{lon});
      way["historic"~"monument|memorial|castle|ruins|fort|archaeological_site|temple"](around:10000,{lat},{lon});
      node["amenity"~"place_of_worship"](around:10000,{lat},{lon});
      way["amenity"~"place_of_worship"](around:10000,{lat},{lon});
      node["leisure"~"park|garden|nature_reserve"](around:10000,{lat},{lon});
      way["leisure"~"park|garden|nature_reserve"](around:10000,{lat},{lon});
    );
    out center 30;
    """
    result = await execute_overpass_query(oq)
    places = []
    for e in result.get("elements", []):
        tags = e.get("tags", {})
        # Prefer English name, fall back to local name
        name = tags.get("name:en") or tags.get("name")
        if not name:
            continue
        # Prioritise famous/well-tagged places
        has_wiki = bool(tags.get("wikidata") or tags.get("wikipedia"))
        place_type = tags.get("tourism") or tags.get("historic") or tags.get("amenity") or tags.get("leisure", "attraction")
        addr_parts = [tags.get("addr:suburb"), tags.get("addr:city"), tags.get("addr:state")]
        address = ", ".join([p for p in addr_parts if p]) or location
        desc = tags.get("description:en") or tags.get("description", "")
        places.append({
            "name": name,
            "type": place_type,
            "address": address,
            "description": desc,
            "website": tags.get("website"),
            "famous": has_wiki,
        })
    # Sort: famous places first
    places.sort(key=lambda x: (not x["famous"], x["name"]))
    return {"location": location, "places": places[:8], "count_returned": min(8, len(places)), "total_found": len(places)}


@mcp.tool()
async def get_place_details(osm_id: str) -> dict:
    """Get details for a specific OpenStreetMap place by its OSM node ID."""
    oq = f"[out:json];(node({osm_id});way({osm_id}););out body;"
    result = await execute_overpass_query(oq)
    if not result.get("elements"):
        return {"error": "Not found"}
    tags = result["elements"][0].get("tags", {})
    return {
        "name": tags.get("name"),
        "description": tags.get("description"),
        "website": tags.get("website"),
        "opening_hours": tags.get("opening_hours"),
    }


if __name__ == "__main__":
    mcp.run(transport="stdio")