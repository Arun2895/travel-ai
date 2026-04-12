import asyncio
from mcp_servers.places_server import search_places

async def test():
    try:
        res = await search_places.ainvoke({"query": "museum", "location": "Tokyo"})
        print(res)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
