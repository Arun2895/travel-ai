from fastapi import FastAPI
from orchestrator import plan_trip

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Travel AI Running 🚀"}

@app.get("/plan")
def get_plan(location: str, budget: int, days: int):
    result = plan_trip(location, budget, days)
    return result