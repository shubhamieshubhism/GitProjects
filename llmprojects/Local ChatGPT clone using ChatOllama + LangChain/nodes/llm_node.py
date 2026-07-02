# # # from langchain_ollama import ChatOllama
# # # from state import State

# # # llm = ChatOllama(model="llama3.1", temperature=0.7)

# # # def llm_node(state: State) -> dict:
# # #     conversation = state["messages"]
# # #     response = llm.invoke(conversation)
# # #     return {"messages": conversation + [response]}

# # #nodes/llm_node.py – add truncation before sending to LLM (extra safety).

# # from langchain_ollama import ChatOllama
# # from state import State

# # llm = ChatOllama(model="llama3.1", temperature=0.7)

# # # Maximum messages to send to the LLM in one call
# # MAX_LLM_CONTEXT = 6

# # def llm_node(state: State) -> dict:
# #     full_conversation = state["messages"]
# #     # Truncate to the most recent messages for the LLM call
# #     if len(full_conversation) > MAX_LLM_CONTEXT:
# #         truncated = full_conversation[-MAX_LLM_CONTEXT:]
# #     else:
# #         truncated = full_conversation
# #     response = llm.invoke(truncated)
# #     # Append the new AI message to the full conversation
# #     return {"messages": full_conversation + [response]}

# from langchain_ollama import ChatOllama
# from langchain_core.messages import AIMessage
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0.7)

# def llm_node(state: State) -> dict:
#     conversation = state["messages"]
#     user_query = conversation[-1].content.lower()
    
#     # Simple rule: if the user asks to calculate something, use tool
#     if any(kw in user_query for kw in ["calculate", "calc", "+", "-", "*", "/"]):
#         # Extract expression (naive)
#         expr = user_query.replace("calculate", "").replace("calc", "").strip()
#         tool_call = {"tool": "calculator", "args": {"expression": expr}}
#         placeholder = AIMessage(content="[Calling calculator tool]")
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

# from langchain_ollama import ChatOllama
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0.7)

# # Maximum messages to send to the LLM in one call (prevents token overflow)
# MAX_LLM_CONTEXT = 6

# def llm_node(state: State) -> dict:
#     full_conversation = state["messages"]
#     # Truncate to most recent messages for the LLM call
#     if len(full_conversation) > MAX_LLM_CONTEXT:
#         truncated = full_conversation[-MAX_LLM_CONTEXT:]
#     else:
#         truncated = full_conversation
#     response = llm.invoke(truncated)
#     # Append the new AI message to the full conversation (state keeps full history? No – we truncate later)
#     return {"messages": full_conversation + [response]}

from langchain_ollama import ChatOllama
from state import State

MAX_LLM_CONTEXT = 6

def llm_node(state: State) -> dict:
    full_conversation = state["messages"]
    temperature = state.get("temperature", 0.7)
    llm = ChatOllama(model="llama3.1", temperature=temperature)

    # Determine confidence and sources based on tool usage
    if len(full_conversation) > 0 and "Tool result:" in full_conversation[-1].content:
        confidence = 0.95
        sources = ["calculator"]
    else:
        confidence = 0.75
        sources = []

    # Truncate conversation for LLM call
    if len(full_conversation) > MAX_LLM_CONTEXT:
        truncated = full_conversation[-MAX_LLM_CONTEXT:]
    else:
        truncated = full_conversation

    response = llm.invoke(truncated)
    return {
        "messages": full_conversation + [response],
        "confidence": confidence,
        "sources": sources
    }