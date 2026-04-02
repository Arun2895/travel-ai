# agents.py

def stay_agent(location, budget):
    return [
        {"name": "Budget Beach Stay", "price": 2000, "rating": 4.2},
        {"name": "Hostel Goa", "price": 800, "rating": 4.0}
    ]


def food_agent(location):
    return [
        {"name": "Seafood Shack", "rating": 4.5},
        {"name": "Cafe Chill", "rating": 4.3}
    ]


def suggestor_agent(location):
    return [
        {
            "name": "Baga Beach",
            "rating": 4.6,
            "description": "Famous for nightlife and water sports"
        },
        {
            "name": "Fort Aguada",
            "rating": 4.5,
            "description": "Historic fort with sea views"
        }
    ]