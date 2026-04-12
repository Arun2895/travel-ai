"""
MCP Server: Hotels (OpenStreetMap)
Runs as a standalone MCP process via stdio transport.
"""

import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("hotels")

from utils import get_coordinates, execute_overpass_query


@mcp.tool()
async def search_hotels(location: str) -> dict:
    """
    Search for hotels, hostels, and guest houses near a city using OpenStreetMap.
    Args:
        location: City name, e.g. 'Tokyo'
    """
    lat, lon = await get_coordinates(location)
    if not lat:
        return {"error": f"Could not find location: {location}"}

    price_map = {"hotel": "$$ - $$$", "hostel": "$", "guest_house": "$$", "apartment": "$$", "motel": "$"}

    oq = f"""
    [out:json][timeout:25];
    (
      node["tourism"~"hotel|hostel|guest_house|apartment|motel"](around:8000,{lat},{lon});
      way["tourism"~"hotel|hostel|guest_house|apartment|motel"](around:8000,{lat},{lon});
    );
    out center 20;
    """
    result = await execute_overpass_query(oq)
    hotels = []
    for e in result.get("elements", []):
        tags = e.get("tags", {})
        name = tags.get("name:en") or tags.get("name")
        if not name:
            continue
        h_type = tags.get("tourism", "hotel")
        addr_parts = [tags.get("addr:street"), tags.get("addr:suburb"), tags.get("addr:city")]
        address = ", ".join([p for p in addr_parts if p]) or location
        hotels.append({
            "name": name,
            "type": h_type,
            "stars": tags.get("stars"),
            "estimated_price_tier": price_map.get(h_type, "$$"),
            "address": address,
            "website": tags.get("website"),
            "phone": tags.get("phone"),
        })
    return {
        "location": location,
        "hotels": hotels[:6],
        "count_returned": min(6, len(hotels)),
        "total_found": len(hotels),
        "note": "Live pricing unavailable. Price tiers are estimated."
    }


@mcp.tool()
async def get_hotel_details(osm_id: str) -> dict:
    """Get details for a specific hotel by its OSM node ID."""
    oq = f"[out:json];(node({osm_id});way({osm_id}););out body;"
    result = await execute_overpass_query(oq)
    if not result.get("elements"):
        return {"error": "Not found"}
    tags = result["elements"][0].get("tags", {})
    return {
        "name": tags.get("name"),
        "type": tags.get("tourism"),
        "stars": tags.get("stars"),
        "website": tags.get("website"),
        "phone": tags.get("phone"),
        "rooms": tags.get("rooms"),
    }


if __name__ == "__main__":
    mcp.run(transport="stdio")
