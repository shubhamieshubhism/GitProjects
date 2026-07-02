from langchain_core.tools import tool
from Module9_HnadsOn.langgraph_agent.mcp_client import MCPTodoClient

# Create a single MCP client instance (reused across tools)
_client = None

def get_client():
    global _client
    if _client is None:
        _client = MCPTodoClient()
        _client.connect()
    return _client

@tool
def add_todo(task: str) -> str:
    """Add a new TODO task. Use this when the user asks to add a task."""
    client = get_client()
    return client.call_tool("add_todo", {"task": task})

@tool
def list_todos() -> str:
    """List all current TODO tasks with their IDs and completion status."""
    client = get_client()
    return client.call_tool("list_todos", {})

@tool
def delete_todo(todo_id: int) -> str:
    """Delete a TODO by its ID. Use this when the user asks to remove or delete a task."""
    client = get_client()
    return client.call_tool("delete_todo", {"todo_id": todo_id})