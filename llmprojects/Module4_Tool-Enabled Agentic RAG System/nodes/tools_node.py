# from langchain_core.messages import ToolMessage
# from state import State
# from tools import handbook_tool,web_search

# #TOOLS_MAP = {"handbook_search": handbook_tool}
# TOOLS_MAP = {
#     "handbook_search": handbook_tool,
#     "web_search": web_search,
# }

# def tools_node(state: State) -> dict:
#     tool_calls = state.get("tool_calls", [])
#     results = []
#     for tc in tool_calls:
#         tool_name = tc.get("name")
#         tool_args = tc.get("args", {})
#         tool_func = TOOLS_MAP.get(tool_name)
#         if tool_func:
#             result = tool_func.invoke(tool_args)
#             tool_msg = ToolMessage(content=result, tool_call_id=tc.get("id", ""))
#             results.append(tool_msg)
#         else:
#             results.append(ToolMessage(content=f"Error: unknown tool {tool_name}", tool_call_id=tc.get("id", "")))
#     return {
#         "messages": results,
#         "next_action": "continue",
#         "tool_calls": []
#     }


# from langchain_core.messages import ToolMessage
# from state import State
# from tools import handbook_tool, web_search

# TOOLS_MAP = {
#     "handbook_search": handbook_tool,
#     "web_search": web_search,
# }

# def tools_node(state: State) -> dict:
#     tool_calls = state.get("tool_calls", [])
#     results = []
#     scratchpad = state.get("scratchpad", "")
#     for tc in tool_calls:
#         tool_name = tc.get("name")
#         tool_args = tc.get("args", {})
#         tool_func = TOOLS_MAP.get(tool_name)
#         if tool_func:
#             # The tool expects a 'query' argument
#             query = tool_args.get("query", "")
#             result = tool_func.invoke(query)
#             tool_msg = ToolMessage(content=result, tool_call_id=tc.get("id", ""))
#             results.append(tool_msg)
#             scratchpad += f"\nObservation: {result}\n"
#         else:
#             scratchpad += f"\nError: unknown tool {tool_name}\n"
#     return {
#         "messages": results,
#         "next_action": "continue",
#         "tool_calls": [],
#         "scratchpad": scratchpad
#     }
from langchain_core.messages import ToolMessage
from state import State
from tools import handbook_tool, web_search

TOOLS_MAP = {
    "handbook_search": handbook_tool,
    "web_search": web_search,
}

def tools_node(state: State) -> dict:
    tool_calls = state.get("tool_calls", [])
    results = []
    scratchpad = state.get("scratchpad", "")
    for tc in tool_calls:
        tool_name = tc.get("name")
        args = tc.get("args", {})
        query = args.get("query", "")
        tool_func = TOOLS_MAP.get(tool_name)
        if tool_func:
            result = tool_func.invoke(query)
            tool_msg = ToolMessage(content=result, tool_call_id="")
            results.append(tool_msg)
            scratchpad += f"\nObservation: {result}\n"
        else:
            scratchpad += f"\nError: unknown tool {tool_name}\n"
    return {
        "messages": results,
        "next_action": "continue",
        "tool_calls": [],
        "scratchpad": scratchpad
    }