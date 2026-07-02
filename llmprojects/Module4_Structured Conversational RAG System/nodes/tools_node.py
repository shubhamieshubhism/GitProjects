from langchain_core.messages import ToolMessage
from state import State
from tools import web_search, handbook_tool

TOOLS_MAP = {
    "handbook_search": handbook_tool,
    "web_search": web_search,
}

def tools_node(state: State) -> dict:
    tool_calls = state.get("tool_calls", [])
    if not tool_calls:
        return {"next_action": "end"}
    
    results = []
    for tc in tool_calls:
        tool_name = tc.get("name")
        tool_args = tc.get("args", {})
        tool_func = TOOLS_MAP.get(tool_name)
        if tool_func:
            result = tool_func.invoke(tool_args)
            tool_msg = ToolMessage(content=result, tool_call_id=tc.get("id", ""))
            results.append(tool_msg)
        else:
            tool_msg = ToolMessage(content=f"Error: unknown tool {tool_name}", tool_call_id=tc.get("id", ""))
            results.append(tool_msg)
    return {
        "messages": results,
        "next_action": "continue",  # go back to agent
        "tool_calls": []
    }