# # from state import State
# # from tools import get_handbook_info
# # from langchain_core.messages import AIMessage

# # TOOLS = {
# #     "get_handbook_info": get_handbook_info
# # }

# # def tool_node(state: State) -> dict:
# #     tool_calls = state.get("tool_calls", [])
# #     if not tool_calls:
# #         return {"next_action": "end", "tool_calls": []}
    
# #     results = []
# #     messages = list(state["messages"])
# #     for call in tool_calls:
# #         tool_name = call.get("tool")
# #         args = call.get("args", {})
# #         if tool_name in TOOLS:
# #             result = TOOLS[tool_name](**args)
# #             results.append(result)
# #             messages.append(AIMessage(content=f"Tool result: {result}"))
# #         else:
# #             error = f"Error: unknown tool '{tool_name}'"
# #             results.append(error)
# #             messages.append(AIMessage(content=error))
    
# #     return {
# #         "messages": messages,
# #         "tool_results": results,
# #         "next_action": "end",   # will go back to LLM via graph edge
# #         "tool_calls": []
# #     }

# # from state import State
# # from tools import get_handbook_info
# # from langchain_core.messages import AIMessage

# # TOOLS = {
# #     "get_handbook_info": get_handbook_info
# # }

# # def tool_node(state: State) -> dict:
# #     tool_calls = state.get("tool_calls", [])
# #     if not tool_calls:
# #         return {"next_action": "end", "tool_calls": []}
    
# #     results = []
# #     messages = list(state["messages"])
# #     for call in tool_calls:
# #         tool_name = call.get("tool")
# #         args = call.get("args", {})
# #         tool_obj = TOOLS.get(tool_name)
# #         if tool_obj:
# #             try:
# #                 # Call the tool using its .invoke() method (StructuredTool)
# #                 result = tool_obj.invoke(args)
# #                 results.append(result)
# #                 messages.append(AIMessage(content=f"Tool result: {result}"))
# #             except Exception as e:
# #                 error = f"Error executing {tool_name}: {str(e)}"
# #                 results.append(error)
# #                 messages.append(AIMessage(content=error))
# #         else:
# #             error = f"Error: unknown tool '{tool_name}'"
# #             results.append(error)
# #             messages.append(AIMessage(content=error))
    
# #     return {
# #         "messages": messages,
# #         "tool_results": results,
# #         "next_action": "end",
# #         "tool_calls": []
# #     }

# from state import State
# from tools import get_handbook_info
# from langchain_core.messages import AIMessage

# TOOLS = {
#     "get_handbook_info": get_handbook_info
# }

# def tool_node(state: State) -> dict:
#     tool_calls = state.get("tool_calls", [])
#     print(f"[DEBUG] tool_node: tool_calls = {tool_calls}")
    
#     if not tool_calls:
#         print("[DEBUG] No tool calls, returning end")
#         return {"next_action": "end", "tool_calls": []}
    
#     results = []
#     messages = list(state["messages"])
#     for call in tool_calls:
#         tool_name = call.get("tool")
#         args = call.get("args", {})
#         print(f"[DEBUG] Executing tool: {tool_name} with args {args}")
#         tool_obj = TOOLS.get(tool_name)
#         if tool_obj:
#             try:
#                 result = tool_obj.invoke(args)
#                 print(f"[DEBUG] Tool result preview: {result[:100]}...")
#                 results.append(result)
#                 messages.append(AIMessage(content=f"Tool result: {result}"))
#             except Exception as e:
#                 print(f"[DEBUG] Exception: {e}")
#                 error = f"Error executing {tool_name}: {str(e)}"
#                 results.append(error)
#                 messages.append(AIMessage(content=error))
#         else:
#             error = f"Error: unknown tool '{tool_name}'"
#             print(f"[DEBUG] {error}")
#             results.append(error)
#             messages.append(AIMessage(content=error))
    
#     return {
#         "messages": messages,
#         "tool_results": results,
#         "next_action": "end",
#         "tool_calls": []
#     }

from state import State
from tools import get_handbook_info
from langchain_core.messages import AIMessage

TOOLS = {
    "get_handbook_info": get_handbook_info
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
                error_msg = f"Error executing {tool_name}: {str(e)}"
                results.append(error_msg)
                messages.append(AIMessage(content=error_msg))
                # Increment retry count for error recovery
                return {
                    "messages": messages,
                    "tool_results": results,
                    "next_action": "end",          # go to LLM to see error
                    "tool_calls": [],
                    "retry_count": state.get("retry_count", 0) + 1,
                    "error_message": error_msg
                }
        else:
            error_msg = f"Error: unknown tool '{tool_name}'"
            results.append(error_msg)
            messages.append(AIMessage(content=error_msg))
            return {
                "messages": messages,
                "tool_results": results,
                "next_action": "end",
                "tool_calls": [],
                "retry_count": state.get("retry_count", 0) + 1,
                "error_message": error_msg
            }
    
    # Success: clear retry counter
    return {
        "messages": messages,
        "tool_results": results,
        "next_action": "end",
        "tool_calls": [],
        "retry_count": 0,
        "error_message": None
    }