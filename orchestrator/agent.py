"""
Travel AI Orchestrator — MCP Client (Structured Pipeline)
──────────────────────────────────────────────────────────
Uses langchain-mcp-adapters to connect to three MCP servers over stdio.
Each server runs as a separate process using the Model Context Protocol.

Architecture:
  FastAPI ─► orchestrator/agent.py (MCP Client + LLM)
                 ├── mcp_servers/places_server.py  (MCP Server process)
                 ├── mcp_servers/food_server.py     (MCP Server process)
                 └── mcp_servers/hotels_server.py   (MCP Server process)

Pipeline:
  1. Connect to MCP servers, load tools
  2. LLM extracts destination & preferences from user query (plain text, no tool calling)
  3. Orchestrator calls MCP tools directly using the loaded tool objects
  4. LLM formats the final travel plan from the real data
"""

import json
import re
import logging
import sys
import asyncio
from pathlib import Path

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_mcp_adapters.client import MultiServerMCPClient

from core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# ── Paths to MCP servers ───────────────────────────────────────────────────

ROOT = Path(__file__).parent.parent
SERVERS = {
    "places": ROOT / "mcp_servers" / "places_server.py",
    "food":   ROOT / "mcp_servers" / "food_server.py",
    "hotels": ROOT / "mcp_servers" / "hotels_server.py",
}


def _get_llm():
    return ChatGroq(
        model=settings.groq_model,
        api_key=settings.groq_api_key,
        temperature=0,
    )


async def _extract_details(llm, query: str) -> dict:
    """Step 1: Use LLM (plain text, no tools) to extract destination & preferences."""
    prompt = f"""Extract travel details from this query. 
    
    IMPORTANT: If the user provides a country (e.g., China, Japan, France), you MUST extract the most famous and relevant major city in that country (e.g., Beijing, Tokyo, Paris) to ensure our search tools return high-quality local data.

    Query: {query}

    Reply ONLY with JSON.
    Format: {{"destination": "city name", "cuisine": "food type or local", "interests": "temples museums parks etc"}}"""

    response = await llm.ainvoke([HumanMessage(content=prompt)])
    text = response.content.strip()

    match = re.search(r'\{.*?\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # Fallback parser
    logger.warning(f"Could not parse LLM JSON, using fallback. LLM said: {text}")
    dest = query.split("to ")[-1].split(" for")[0].split(".")[0].strip()[:30] if "to " in query else "Tokyo"
    return {"destination": dest, "cuisine": "local", "interests": "attractions"}


async def _call_mcp_tool(tools: list, tool_name: str, args: dict) -> dict:
    """Find an MCP tool by name and invoke it."""
    for t in tools:
        if t.name == tool_name:
            try:
                result = await t.ainvoke(args)
                # MCP tools may return strings or dicts
                if isinstance(result, str):
                    try:
                        return json.loads(result)
                    except json.JSONDecodeError:
                        return {"data": result}
                return result
            except Exception as e:
                logger.error(f"MCP tool '{tool_name}' failed: {e}")
                return {"error": str(e)}
    return {"error": f"Tool '{tool_name}' not found"}


async def run_travel_query(query: str, thread_id: str = "default") -> dict:
    """
    Orchestrates a travel query using MCP servers.
    Connects to servers, loads tools via MCP, calls them, and formats results.
    """
    llm = _get_llm()

    # ── Connect to MCP servers ──────────────────────────────────────────────
    mcp_config = {
        name: {
            "command": sys.executable,
            "args": [str(path)],
            "transport": "stdio",
        }
        for name, path in SERVERS.items()
    }

    client = MultiServerMCPClient(mcp_config)
    tools = await client.get_tools()
    tool_names = [t.name for t in tools]
    logger.info(f"[{thread_id}] MCP tools loaded: {tool_names}")

    # ── Step 1: Extract destination & preferences ───────────────────────────
    logger.info(f"[{thread_id}] Extracting destination from query...")
    details = await _extract_details(llm, query)
    destination = details.get("destination", "Tokyo")
    cuisine = details.get("cuisine", "local")
    interests = details.get("interests", "attractions")
    logger.info(f"[{thread_id}] Destination: {destination}, Cuisine: {cuisine}")

    # ── Step 2: Call MCP tools ──────────────────────────────────────────────
    tool_calls_made = []

    logger.info(f"[{thread_id}] Calling MCP tool: search_places")
    places_result = await _call_mcp_tool(tools, "search_places", {
        "query": interests, "location": destination
    })
    tool_calls_made.append({"tool": "search_places", "input": {"query": interests, "location": destination}})

    await asyncio.sleep(0.5)

    logger.info(f"[{thread_id}] Calling MCP tool: search_restaurants")
    food_result = await _call_mcp_tool(tools, "search_restaurants", {
        "cuisine": cuisine, "location": destination
    })
    tool_calls_made.append({"tool": "search_restaurants", "input": {"cuisine": cuisine, "location": destination}})

    await asyncio.sleep(0.5)

    logger.info(f"[{thread_id}] Calling MCP tool: search_hotels")
    hotels_result = await _call_mcp_tool(tools, "search_hotels", {
        "location": destination
    })
    tool_calls_made.append({"tool": "search_hotels", "input": {"location": destination}})

    # ── Step 3: Format final plan via LLM ───────────────────────────────────
    logger.info(f"[{thread_id}] Formatting final travel plan...")

    format_prompt = f"""You are TravelGuide, a premium AI travel planner. Create a beautifully formatted travel plan using ONLY the REAL data below from our MCP servers.

USER QUERY: {query}
DESTINATION: {destination}

PLACES DATA:
{json.dumps(places_result, indent=2, default=str)}

FOOD DATA:
{json.dumps(food_result, indent=2, default=str)}

HOTELS DATA:
{json.dumps(hotels_result, indent=2, default=str)}

ABSOLUTE RULES — YOU MUST FOLLOW THESE:
1. You MUST use the actual "name" field from the JSON data above. If a place, hotel, or restaurant has a missing, generic (e.g. "unknown"), or invalid name, do NOT include it in your response.
2. If tool results are limited (e.g. fewer than 3 options), use your internal knowledge about {destination} to provide unique recommendations. Do NOT use labels like "Recommended from our local guide database"—just list the names directly.
3. If NO REAL data is found for a section (Hotels, Food, or Places) and you have no high-quality knowledge to supplement it for {destination}, OMIT that section entirely from your response. Do NOT show "No hotels/restaurants available" messages.
4. Use the LOCAL CURRENCY of {destination} for all prices. If the user's budget is in a different currency, mention the conversion (e.g. "Your budget of ₹45,000 ≈ ₩720,000").
5. For restaurants, ALWAYS include the "address" field from the data.
6. For hotels, estimate a realistic nightly price RANGE in local currency.
7. For places, include the "address" and a 2-line description (Line 1: what it is, Line 2: what to do there).
8. ITINERARY VARIETY IS CRITICAL: Each day MUST be unique. Do NOT repeat the same activities daily. If you run out of unique tool-provided places, suggest logical activities like "Local park walk", "Visit a traditional market", or "Check out the city skyline".
9. Add a total row at the bottom of the itinerary table.
10. NEVER use bullet points (• or *) or bold headers with asterisks (like **Travel Tips**). Use plain text blocks or numbered lists for tips.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

Hey there! Welcome to TravelGuide ✈️

{destination} is an incredible choice! [2 enthusiastic sentences about this destination]. 

[If you searched for a city because the user mentioned a country, add: "To give you the best data, I've focused this plan on **{destination}**, the heart of the region."]

[If user gave budget in a different currency, add: "Your budget of [amount] ≈ [converted amount in local currency]"]

---

🏨 Where to Stay

| Hotel | Type | Location | Est. Price/Night |
|-------|------|----------|-----------------|
| [ACTUAL hotel name from data] | [type] | [address from data] | [estimated price in local currency] |
[Repeat for 3-4 hotels]

---

🗺️ Must-Visit Places

[ACTUAL place name from data] — [type] — [address from data]
[Line 1: what it is]
[Line 2: what to do there]

[Repeat for 5-8 places]

---

🍽️ Food & Restaurants

[ACTUAL restaurant name from data] ([cuisine]) — 📍 [address from data]
[Line 1: what it is]
[Line 2: what to do there]

[Repeat for 4-6 restaurants]

---

📅 Day-by-Day Itinerary

| Day | Morning | Afternoon | Evening | Est. Daily Budget |
|-----|---------|-----------|---------|------------------|
| Day 1 | [activity] | [activity] | [activity] | [amount in local currency] |
[Repeat for each day - ENSURE VARIETY]
| | | | **Total Est.** | **[sum in local currency]** |

---

💡 Travel Tips
1. [tip 1]
2. [tip 2]
3. [tip 3]

_Prices are estimates. Always verify current rates before booking._"""

    try:
        response = await llm.ainvoke([
            SystemMessage(content="You are TravelGuide, a premium AI travel planner. You MUST produce high-quality, variable itineraries. NEVER repeat activities daily. If the data is sparse, use your knowledge to suggest varied local experiences. Use markdown formatting with orange headers."),
            HumanMessage(content=format_prompt),
        ])
        final_answer = response.content
    except Exception as e:
        logger.error(f"[{thread_id}] LLM formatting failed: {e}")
        final_answer = (
            f"I found data for {destination} via MCP but hit an error formatting the response.\n\n"
            f"Raw Places: {places_result}\n\nRaw Food: {food_result}\n\nRaw Hotels: {hotels_result}"
        )

    return {
        "answer": final_answer,
        "tool_calls": tool_calls_made,
        "tools_used": list({t["tool"] for t in tool_calls_made}),
    }