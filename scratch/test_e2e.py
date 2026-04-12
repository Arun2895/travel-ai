"""End-to-end test of the MCP pipeline."""
import asyncio
import sys
sys.path.insert(0, ".")

async def test():
    from orchestrator.agent import run_travel_query
    
    print("=== Starting Travel AI MCP Pipeline Test ===")
    print("Query: 'Best places to see in Paris'")
    print()
    
    result = await run_travel_query("Best places to see in Paris", thread_id="test-1")
    
    print("=== TOOLS USED ===")
    print(result["tools_used"])
    print()
    print("=== TOOL CALLS ===")
    for tc in result["tool_calls"]:
        print(f"  - {tc['tool']}: {tc['input']}")
    print()
    print("=== ANSWER (first 500 chars) ===")
    print(result["answer"][:500])
    print()
    print("=== TEST COMPLETE ===")

if __name__ == "__main__":
    asyncio.run(test())
