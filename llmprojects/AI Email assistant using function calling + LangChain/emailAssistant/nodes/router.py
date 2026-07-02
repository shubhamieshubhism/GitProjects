from state import State
from langgraph.graph import END

def router_node(state: State) -> str:
    """Decide which node to go to after call_llm."""
    action = state.get("next_action", "end")
    if action == "call_tool":
        return "tool_node"
    else:
        return END