from state import State
from tools import calculator
from langchain_core.messages import AIMessage

TOOLS = {
    "calculator": calculator
}

def tool_node(state: State) -> dict:
    tool_calls = state.get("tool_calls", [])
    if not tool_calls:
        return {"next_action": "end", "tool_calls": []}

    results = []
    messages = list(state["messages"])
    for call in tool_calls:
        tool_name = call.get("tool")
        args = call.get("args", {})
        tool_obj = TOOLS.get(tool_name)
        if tool_obj:
            try:
                result = tool_obj.invoke(args)
                results.append(result)
                messages.append(AIMessage(content=f"Tool result: {result}"))
            except Exception as e:
                error = f"Error: {str(e)}"
                results.append(error)
                messages.append(AIMessage(content=error))
        else:
            error = f"Unknown tool '{tool_name}'"
            results.append(error)
            messages.append(AIMessage(content=error))

    return {
        "messages": messages,
        "tool_results": results,
        "next_action": "end",
        "tool_calls": []
    }