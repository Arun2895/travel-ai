"""
Travel AI — FastAPI Application
"""

import logging
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from core.config import get_settings
from orchestrator.agent import run_travel_query

# ── Logging ────────────────────────────────────────────────────────────────

settings = get_settings()
logging.basicConfig(level=getattr(logging, settings.log_level, logging.INFO))
logger = logging.getLogger("travel_ai")


# ── Lifespan ───────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🌍 Travel AI starting up...")
    yield
    logger.info("Travel AI shutting down.")


# ── App ────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Travel AI",
    description="LangChain + MCP-powered travel planning assistant",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User's travel query")
    thread_id: str | None = Field(default=None, description="Conversation ID for multi-turn context")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "message": "Plan a 3-day trip to Tokyo for 2 people. We love street food and temples. Budget hotel is fine.",
                    "thread_id": "user-session-abc123"
                }
            ]
        }
    }


class ToolCallInfo(BaseModel):
    tool: str
    input: dict | None = None


class ChatResponse(BaseModel):
    thread_id: str
    answer: str
    tools_used: list[str]
    tool_calls: list[ToolCallInfo]


# ── Routes ─────────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health():
    return {"status": "ok", "service": "travel_ai"}


@app.post("/chat", response_model=ChatResponse, tags=["Travel AI"])
async def chat(request: ChatRequest):
    """
    Send a travel query to the AI agent.

    The agent will:
    - Search for places, food, and hotels using real APIs
    - Reason over the results
    - Return a complete travel recommendation

    **Example queries:**
    - "Find me a beachfront hotel in Bali for next weekend, 2 adults"
    - "What are the best ramen spots near Shinjuku Tokyo?"
    - "Plan a romantic 4-day Paris trip with a mid-range budget"
    """
    thread_id = request.thread_id or str(uuid.uuid4())

    logger.info(f"[{thread_id}] Query: {request.message[:80]}...")

    try:
        result = await run_travel_query(query=request.message, thread_id=thread_id)
    except Exception as e:
        logger.exception(f"[{thread_id}] Agent error: {e}")
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

    logger.info(f"[{thread_id}] Tools used: {result['tools_used']}")

    return ChatResponse(
        thread_id=thread_id,
        answer=result["answer"],
        tools_used=result["tools_used"],
        tool_calls=[ToolCallInfo(**tc) for tc in result["tool_calls"]],
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)