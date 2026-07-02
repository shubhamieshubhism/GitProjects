from state import State
from langgraph.graph import END

def router_node(state: State) -> str:
    action = state.get("next_action", "end")
    if action == "call_tool":
        return "tools_node"
    else:
        return END