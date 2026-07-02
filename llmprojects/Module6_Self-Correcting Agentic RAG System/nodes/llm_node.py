# # # from langchain_ollama import ChatOllama
# # # from state import State

# # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # def llm_node(state: State) -> dict:
# # #     conversation = state["messages"]
# # #     response = llm.invoke(conversation)
# # #     # Append the new AI message to the list
# # #     return {"messages": conversation + [response]}

# # from langchain_ollama import ChatOllama
# # from langchain_core.messages import AIMessage
# # from state import State

# # llm = ChatOllama(model="llama3.1", temperature=0)

# # def llm_node(state: State) -> dict:
# #     conversation = state["messages"]
# #     user_query = conversation[-1].content.lower()

# #     # NEW: movie/series keywords instead of HR policies
# #     if any(kw in user_query for kw in [
# #         "avengers", "endgame", "infinity war", "john wick", "harry potter",
# #         "voldemort", "hogwarts", "thanos", "iron man", "captain america",
# #         "keanu reeves", "continental", "blip", "infinity stones", "sorcerer's stone"
# #     ]):
# #         tool_call = {"tool": "get_handbook_info", "args": {"query": user_query}}
# #         placeholder = AIMessage(content=f"[Calling tool: get_handbook_info]")
# #         return {
# #             "messages": conversation + [placeholder],
# #             "tool_calls": [tool_call],
# #             "next_action": "call_tool"
# #         }
# #     else:
# #         response = llm.invoke(conversation)
# #         return {
# #             "messages": conversation + [response],
# #             "tool_calls": [],
# #             "next_action": "end"
# #         }

# from langchain_ollama import ChatOllama
# from langchain_core.messages import AIMessage
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0)

# def llm_node(state: State) -> dict:
#     conversation = state["messages"]
    
#     # If the last message is a tool result, generate a final answer
#     if len(conversation) > 0 and "Tool result:" in conversation[-1].content:
#         response = llm.invoke(conversation)
#         return {
#             "messages": conversation + [response],
#             "tool_calls": [],
#             "next_action": "end"
#         }
    
#     user_query = conversation[-1].content.lower()
    
#     # Check if user wants movie/series info (tool)
#     if any(kw in user_query for kw in [
#         "avengers", "endgame", "infinity war", "john wick", "harry potter",
#         "voldemort", "hogwarts", "thanos", "iron man", "captain america",
#         "keanu reeves", "continental", "blip", "infinity stones", "sorcerer's stone"
#     ]):
#         tool_call = {"tool": "get_handbook_info", "args": {"query": user_query}}
#         placeholder = AIMessage(content=f"[Calling tool: get_handbook_info]")
#         return {
#             "messages": conversation + [placeholder],
#             "tool_calls": [tool_call],
#             "next_action": "call_tool"
#         }
#     else:
#         response = llm.invoke(conversation)
#         return {
#             "messages": conversation + [response],
#             "tool_calls": [],
#             "next_action": "end"
#         }
from langchain_ollama import ChatOllama
from langchain_core.messages import AIMessage
from state import State

llm = ChatOllama(model="llama3.1", temperature=0)

def llm_node(state: State) -> dict:
    messages = state["messages"]
    iterations = state.get("iterations", 0) + 1
    retry_count = state.get("retry_count", 0)
    max_retries = state.get("max_retries", 3)
    
    # Stop if too many iterations (safety)
    if iterations > 10:
        fallback = AIMessage(content="I've reached the maximum number of steps. Please ask a simpler question.")
        return {
            "messages": messages + [fallback],
            "tool_calls": [],
            "next_action": "end",
            "iterations": iterations,
            "retry_count": retry_count
        }
    
    # If retries exceeded, answer with fallback
    if retry_count >= max_retries:
        fallback = AIMessage(content="I'm having trouble answering that. Please try rephrasing your question.")
        return {
            "messages": messages + [fallback],
            "tool_calls": [],
            "next_action": "end",
            "iterations": iterations,
            "retry_count": retry_count
        }
    
    # If last message is a tool result, generate final answer
    if len(messages) > 0 and "Tool result:" in messages[-1].content:
        response = llm.invoke(messages)
        return {
            "messages": messages + [response],
            "tool_calls": [],
            "next_action": "end",
            "iterations": iterations,
            "retry_count": retry_count
        }
    
    # Get last user message
    last_user = ""
    for m in reversed(messages):
        if hasattr(m, 'type') and m.type == 'human':
            last_user = m.content.lower()
            break
    
    # Decide: call tool or answer directly
    if any(kw in last_user for kw in [
        "avengers", "endgame", "infinity war", "john wick", "harry potter",
        "voldemort", "hogwarts", "thanos", "iron man", "captain america",
        "keanu reeves", "continental", "blip", "infinity stones", "sorcerer's stone"
    ]):
        tool_call = {"tool": "get_handbook_info", "args": {"query": last_user}}
        placeholder = AIMessage(content="[Calling tool: get_handbook_info]")
        return {
            "messages": messages + [placeholder],
            "tool_calls": [tool_call],
            "next_action": "call_tool",
            "iterations": iterations,
            "retry_count": retry_count
        }
    else:
        response = llm.invoke(messages)
        return {
            "messages": messages + [response],
            "tool_calls": [],
            "next_action": "end",
            "iterations": iterations,
            "retry_count": retry_count
        }