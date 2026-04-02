import google.generativeai as genai
from agents import get_stays, get_food, get_places

# 🔑 Configure API
genai.configure(GOOGLE_GEMINI_KEY)

# Load model
model = genai.GenerativeModel("gemini-1.5-flash")


def plan_trip_with_llm(location: str, budget: int, days: int):

    # 🧩 Step 1: Call MCP tools (Python agents)
    stays = get_stays(location, budget)
    food = get_food(location)
    places = get_places(location)

    # 🧠 Step 2: Create structured prompt
    prompt = f"""
    You are an intelligent travel planner.

    Plan a {days}-day trip to {location} under ₹{budget}.

    Available data:

    Stays:
    {stays}

    Food:
    {food}

    Places:
    {places}

    Instructions:
    - Create a day-wise itinerary
    - Include stay, food, and places each day
    - Keep it within budget
    - Make it realistic and non-repetitive
    - Add short descriptions

    Output format:

    Day 1:
    - Stay:
    - Visit:
    - Food:

    Day 2:
    ...
    """

    # 🤖 Step 3: Generate response
    response = model.generate_content(prompt)

    return response.text