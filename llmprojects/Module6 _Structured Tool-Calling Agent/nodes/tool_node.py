# # # # # from state import State
# # # # # from tools import get_weather

# # # # # TOOLS = {
# # # # #     "get_weather": get_weather
# # # # # }

# # # # # def tool_node(state: State) -> dict:
# # # # #     tool_calls = state.get("tool_calls", [])
# # # # #     results = []
# # # # #     for call in tool_calls:
# # # # #         tool_name = call.get("tool")
# # # # #         args = call.get("args", {})
# # # # #         if tool_name in TOOLS:
# # # # #             result = TOOLS[tool_name](**args)
# # # # #             results.append(result)
# # # # #         else:
# # # # #             results.append(f"Error: unknown tool '{tool_name}'")
# # # # #     return {
# # # # #         "tool_results": results,
# # # # #         "next_action": "end"
# # # # #     }

# # # # """Update tools/tool_node.py to handle empty tool calls"""

# # # # from state import State
# # # # from tools import get_weather

# # # # TOOLS = {
# # # #     "get_weather": get_weather
# # # # }

# # # # def tool_node(state: State) -> dict:
# # # #     tool_calls = state.get("tool_calls", [])
# # # #     if not tool_calls:
# # # #         return {"tool_results": [], "next_action": "end"}
    
# # # #     results = []
# # # #     for call in tool_calls:
# # # #         tool_name = call.get("tool")
# # # #         args = call.get("args", {})
# # # #         if tool_name in TOOLS:
# # # #             result = TOOLS[tool_name](**args)
# # # #             results.append(result)
# # # #         else:
# # # #             results.append(f"Error: unknown tool '{tool_name}'")
# # # #     return {
# # # #         "tool_results": results,
# # # #         "next_action": "end"
# # # #     }

# # # from state import State
# # # from tools import get_weather

# # # TOOLS = {
# # #     "get_weather": get_weather
# # # }

# # # def tool_node(state: State) -> dict:
# # #     tool_calls = state.get("tool_calls", [])
# # #     if not tool_calls:
# # #         return {"tool_results": [], "next_action": "end", "tool_calls": []}
    
# # #     results = []
# # #     for call in tool_calls:
# # #         tool_name = call.get("tool")
# # #         args = call.get("args", {})
# # #         if tool_name in TOOLS:
# # #             result = TOOLS[tool_name](**args)
# # #             results.append(result)
# # #         else:
# # #             results.append(f"Error: unknown tool '{tool_name}'")
    
# # #     # Clear tool_calls after execution
# # #     return {
# # #         "tool_results": results,
# # #         "next_action": "end",
# # #         "tool_calls": []           # <--- ADD THIS
# # #     }


# # """(updated to include calculator)"""
# # from state import State
# # from tools import get_weather, calculate

# # TOOLS = {
# #     "get_weather": get_weather,
# #     "calculate": calculate
# # }

# # def tool_node(state: State) -> dict:
# #     tool_calls = state.get("tool_calls", [])
# #     if not tool_calls:
# #         return {"tool_results": [], "next_action": "end", "tool_calls": []}
    
# #     results = []
# #     for call in tool_calls:
# #         tool_name = call.get("tool")
# #         args = call.get("args", {})
# #         if tool_name in TOOLS:
# #             try:
# #                 result = TOOLS[tool_name](**args)
# #                 results.append(result)
# #             except Exception as e:
# #                 results.append(f"Error executing {tool_name}: {str(e)}")
# #         else:
# #             results.append(f"Error: unknown tool '{tool_name}'")
    
# #     return {
# #         "tool_results": results,
# #         "next_action": "end",
# #         "tool_calls": []
# #     }
    
# from state import State
# from tools import get_weather, calculate
# from langchain_core.messages import AIMessage

# TOOLS = {
#     "get_weather": get_weather,
#     "calculate": calculate
# }

# def tool_node(state: State) -> dict:
#     tool_calls = state.get("tool_calls", [])
#     if not tool_calls:
#         return {"next_action": "end", "tool_calls": []}

#     results = []
#     messages = list(state["messages"])
#     for call in tool_calls:
#         tool_name = call.get("tool")
#         args = call.get("args", {})
#         if tool_name in TOOLS:
#             try:
#                 result = TOOLS[tool_name](**args)
#                 results.append(result)
#                 messages.append(AIMessage(content=f"Tool result: {result}"))
#             except Exception as e:
#                 err_msg = f"Error: {str(e)}"
#                 results.append(err_msg)
#                 messages.append(AIMessage(content=err_msg))
#         else:
#             err_msg = f"Error: unknown tool '{tool_name}'"
#             results.append(err_msg)
#             messages.append(AIMessage(content=err_msg))

#     return {
#         "messages": messages,
#         "tool_results": results,
#         "next_action": "end",   # important: reset to end, but edge tool->llm will override
#         "tool_calls": []        # clear tool calls
#     }

from state import State
from tools import get_weather, calculate
from langchain_core.messages import AIMessage
from utils.logger import setup_logger

logger = setup_logger()

TOOLS = {
    "get_weather": get_weather,
    "calculate": calculate
}

def tool_node(state: State) -> dict:
    tool_calls = state.get("tool_calls", [])
    if not tool_calls:
        logger.info("No tool calls found – skipping tool node.")
        return {"next_action": "end", "tool_calls": []}

    logger.info(f"Executing {len(tool_calls)} tool call(s).")
    results = []
    messages = list(state["messages"])

    for call in tool_calls:
        tool_name = call.get("tool")
        args = call.get("args", {})
        logger.info(f"Tool: {tool_name}, args: {args}")

        if tool_name in TOOLS:
            try:
                result = TOOLS[tool_name](**args)
                results.append(result)
                messages.append(AIMessage(content=f"Tool result: {result}"))
                logger.info(f"Tool execution successful. Result: {result[:100]}")
            except Exception as e:
                error_msg = f"Error executing {tool_name}: {str(e)}"
                results.append(error_msg)
                messages.append(AIMessage(content=error_msg))
                logger.error(error_msg)
        else:
            error_msg = f"Error: unknown tool '{tool_name}'"
            results.append(error_msg)
            messages.append(AIMessage(content=error_msg))
            logger.error(error_msg)

    # Clear tool_calls and set next_action to 'end'
    return {
        "messages": messages,
        "tool_results": results,
        "next_action": "end",
        "tool_calls": []
    }