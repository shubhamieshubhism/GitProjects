# # # from state import State
# # # from tools import search_knowledge_base
# # # from langchain_core.messages import AIMessage

# # # TOOLS = {
# # #     "search_knowledge_base": search_knowledge_base
# # # }

# # # def tool_node(state: State) -> dict:
# # #     tool_calls = state.get("tool_calls", [])
# # #     if not tool_calls:
# # #         return {"next_action": "end", "tool_calls": []}
    
# # #     results = []
# # #     messages = list(state["messages"])
# # #     for call in tool_calls:
# # #         tool_name = call.get("tool")
# # #         args = call.get("args", {})
# # #         tool_obj = TOOLS.get(tool_name)
# # #         if tool_obj:
# # #             try:
# # #                 result = tool_obj.invoke(args)
# # #                 results.append(result)
# # #                 messages.append(AIMessage(content=f"Tool result: {result}"))
# # #             except Exception as e:
# # #                 error = f"Error executing {tool_name}: {str(e)}"
# # #                 results.append(error)
# # #                 messages.append(AIMessage(content=error))
# # #         else:
# # #             error = f"Error: unknown tool '{tool_name}'"
# # #             results.append(error)
# # #             messages.append(AIMessage(content=error))
    
# # #     return {
# # #         "messages": messages,
# # #         "tool_results": results,
# # #         "next_action": "end",
# # #         "tool_calls": []
# # #     }
# # from state import State
# # from tools import search_knowledge_base
# # from langchain_core.messages import AIMessage

# # TOOLS = {
# #     "search_knowledge_base": search_knowledge_base
# # }

# # def tool_node(state: State) -> dict:
# #     tool_calls = state.get("tool_calls", [])
# #     print(f"[DEBUG tool_node] Received tool_calls: {tool_calls}")
    
# #     if not tool_calls:
# #         print("[DEBUG tool_node] No tool calls → returning end")
# #         return {"next_action": "end", "tool_calls": []}
    
# #     results = []
# #     messages = list(state["messages"])
    
# #     for call in tool_calls:
# #         tool_name = call.get("tool")
# #         args = call.get("args", {})
# #         print(f"[DEBUG tool_node] Executing tool '{tool_name}' with args: {args}")
        
# #         tool_obj = TOOLS.get(tool_name)
# #         if tool_obj:
# #             try:
# #                 result = tool_obj.invoke(args)
# #                 print(f"[DEBUG tool_node] Tool result preview: {result[:200]}...")
# #                 results.append(result)
# #                 messages.append(AIMessage(content=f"Tool result: {result}"))
# #             except Exception as e:
# #                 print(f"[DEBUG tool_node] Exception: {e}")
# #                 error_msg = f"Error executing {tool_name}: {str(e)}"
# #                 results.append(error_msg)
# #                 messages.append(AIMessage(content=error_msg))
# #         else:
# #             error_msg = f"Error: unknown tool '{tool_name}'"
# #             print(f"[DEBUG tool_node] {error_msg}")
# #             results.append(error_msg)
# #             messages.append(AIMessage(content=error_msg))
    
# #     return {
# #         "messages": messages,
# #         "tool_results": results,
# #         "next_action": "end",
# #         "tool_calls": []
# #     }


# #tool_node.py (with evaluation logging)
# from state import State
# from tools import search_knowledge_base
# from langchain_core.messages import AIMessage

# # Import evaluation logging
# from utils.eval import log_metric

# TOOLS = {
#     "search_knowledge_base": search_knowledge_base
# }

# def tool_node(state: State) -> dict:
#     tool_calls = state.get("tool_calls", [])
#     turn_id = state.get("turn_id", 0)

#     if not tool_calls:
#         return {"next_action": "end", "tool_calls": []}
    
#     results = []
#     messages = list(state["messages"])
#     for call in tool_calls:
#         tool_name = call.get("tool")
#         args = call.get("args", {})
#         tool_obj = TOOLS.get(tool_name)
#         if tool_obj:
#             try:
#                 result = tool_obj.invoke(args)
#                 results.append(result)
#                 messages.append(AIMessage(content=f"Tool result: {result}"))
                
#                 # Log retrieval success
#                 log_metric(
#                     turn_id=turn_id,
#                     metric_name="retrieval_success",
#                     value=1,
#                     metadata={"query": args.get("query"), "num_results": 1}
#                 )
#             except Exception as e:
#                 error = f"Error executing {tool_name}: {str(e)}"
#                 results.append(error)
#                 messages.append(AIMessage(content=error))
#                 log_metric(
#                     turn_id=turn_id,
#                     metric_name="retrieval_success",
#                     value=0,
#                     metadata={"query": args.get("query"), "error": str(e)}
#                 )
#         else:
#             error = f"Error: unknown tool '{tool_name}'"
#             results.append(error)
#             messages.append(AIMessage(content=error))
#             log_metric(
#                 turn_id=turn_id,
#                 metric_name="tool_error",
#                 value=1,
#                 metadata={"tool": tool_name}
#             )
    
#     return {
#         "messages": messages,
#         "tool_results": results,
#         "next_action": "end",
#         "tool_calls": []
#     }

from state import State
from tools import search_knowledge_base
from langchain_core.messages import AIMessage
from utils.eval import log_metric

TOOLS = {
    "search_knowledge_base": search_knowledge_base
}

def tool_node(state: State) -> dict:
    tool_calls = state.get("tool_calls", [])
    turn_id = state.get("turn_id", 0)
    
    if not tool_calls:
        return {"next_action": "end", "tool_calls": [], "turn_id": turn_id}
    
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
                log_metric(turn_id, "retrieval_success", 1, {"query": args.get("query"), "num_results": 1})
            except Exception as e:
                error = f"Error executing {tool_name}: {str(e)}"
                results.append(error)
                messages.append(AIMessage(content=error))
                log_metric(turn_id, "retrieval_success", 0, {"query": args.get("query"), "error": str(e)})
        else:
            error = f"Error: unknown tool '{tool_name}'"
            results.append(error)
            messages.append(AIMessage(content=error))
            log_metric(turn_id, "tool_error", 1, {"tool": tool_name})
    
    return {
        "messages": messages,
        "tool_results": results,
        "next_action": "end",
        "tool_calls": [],
        "turn_id": turn_id
    }