"""
MCP Server: Food / Restaurants (OpenStreetMap)
Runs as a standalone MCP process via stdio transport.
"""

import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("food")

from utils import get_coordinates, execute_overpass_query


@mcp.tool()
async def search_restaurants(cuisine: str, location: str) -> dict:
    """
    Search for restaurants, cafes, or street food spots near a city.
    Args:
        cuisine: Type of food, e.g. 'ramen', 'sushi', 'pizza', 'local'
        location: City name, e.g. 'Tokyo'
    """
    lat, lon = await get_coordinates(location)
    if not lat:
        return {"error": f"Could not find location: {location}"}

    cuisine_filter = f'["cuisine"~"{cuisine}",i]' if cuisine and cuisine != "local" else ""
    oq = f"""
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|cafe|fast_food"]{cuisine_filter}(around:8000,{lat},{lon});
      way["amenity"~"restaurant|cafe|fast_food"]{cuisine_filter}(around:8000,{lat},{lon});
    );
    out center 20;
    """
    result = await execute_overpass_query(oq)
    restaurants = []
    for e in result.get("elements", []):
        tags = e.get("tags", {})
        name = tags.get("name:en") or tags.get("name")
        if not name:
            continue
        addr_parts = [tags.get("addr:street"), tags.get("addr:suburb"), tags.get("addr:city")]
        address = ", ".join([p for p in addr_parts if p]) or location
        restaurants.append({
            "name": name,
            "cuisine": tags.get("cuisine", cuisine),
            "type": tags.get("amenity"),
            "address": address,
            "opening_hours": tags.get("opening_hours"),
            "website": tags.get("website"),
        })
    return {"location": location, "restaurants": restaurants[:6], "count_returned": min(6, len(restaurants)), "total_found": len(restaurants)}


@mcp.tool()
async def get_restaurant_details(osm_id: str) -> dict:
    """Get details for a specific restaurant by its OSM node ID."""
    oq = f"[out:json];(node({osm_id});way({osm_id}););out body;"
    result = await execute_overpass_query(oq)
    if not result.get("elements"):
        return {"error": "Not found"}
    tags = result["elements"][0].get("tags", {})
    return {
        "name": tags.get("name"),
        "cuisine": tags.get("cuisine"),
        "phone": tags.get("phone"),
        "website": tags.get("website"),
        "opening_hours": tags.get("opening_hours"),
    }


if __name__ == "__main__":
    mcp.run(transport="stdio")