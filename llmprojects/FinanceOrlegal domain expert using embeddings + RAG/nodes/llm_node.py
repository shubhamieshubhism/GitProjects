# # # # # # from langchain_ollama import ChatOllama
# # # # # # from state import State

# # # # # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # # # def llm_node(state: State) -> dict:
# # # # # #     conversation = state["messages"]
# # # # # #     response = llm.invoke(conversation)
# # # # # #     # Append the new AI message to the list
# # # # # #     return {"messages": conversation + [response]}

# # # # # """ (modify – decide to call tool)"""

# # # # # from langchain_ollama import ChatOllama
# # # # # from langchain_core.messages import AIMessage
# # # # # from state import State

# # # # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # # def llm_node(state: State) -> dict:
# # # # #     conversation = state["messages"]
# # # # #     user_query = conversation[-1].content.lower()
    
# # # # #     # Simple rule: if query mentions finance/legal terms, call tool
# # # # #     if any(kw in user_query for kw in ["contract", "regulation", "GDPR", "bond", "stock", "legal", "finance"]):
# # # # #         tool_call = {"tool": "search_knowledge_base", "args": {"query": user_query}}
# # # # #         placeholder = AIMessage(content="[Calling knowledge base tool]")
# # # # #         return {
# # # # #             "messages": conversation + [placeholder],
# # # # #             "tool_calls": [tool_call],
# # # # #             "next_action": "call_tool"
# # # # #         }
# # # # #     else:
# # # # #         response = llm.invoke(conversation)
# # # # #         return {
# # # # #             "messages": conversation + [response],
# # # # #             "tool_calls": [],
# # # # #             "next_action": "end"
# # # # #         }

# # # # from langchain_ollama import ChatOllama
# # # # from langchain_core.messages import AIMessage
# # # # from state import State

# # # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # def llm_node(state: State) -> dict:
# # # #     conversation = state["messages"]
# # # #     user_query = conversation[-1].content.lower()
    
# # # #     print(f"[DEBUG llm_node] user_query = {user_query}")
    
# # # #     # If the last message is a tool result, generate final answer
# # # #     if len(conversation) > 0 and "Tool result:" in conversation[-1].content:
# # # #         print("[DEBUG llm_node] Tool result detected, generating final answer")
# # # #         response = llm.invoke(conversation)
# # # #         return {
# # # #             "messages": conversation + [response],
# # # #             "tool_calls": [],
# # # #             "next_action": "end"
# # # #         }
    
# # # #     # Rule‑based tool selection
# # # #     keywords = ["contract", "regulation", "gdpr", "bond", "stock", "legal", "finance"]
# # # #     if any(kw in user_query for kw in keywords):
# # # #         print("[DEBUG llm_node] Keyword matched → calling tool")
# # # #         tool_call = {"tool": "search_knowledge_base", "args": {"query": user_query}}
# # # #         placeholder = AIMessage(content="[Calling knowledge base tool]")
# # # #         return {
# # # #             "messages": conversation + [placeholder],
# # # #             "tool_calls": [tool_call],
# # # #             "next_action": "call_tool"
# # # #         }
# # # #     else:
# # # #         print("[DEBUG llm_node] No tool needed → answering directly")
# # # #         response = llm.invoke(conversation)
# # # #         return {
# # # #             "messages": conversation + [response],
# # # #             "tool_calls": [],
# # # #             "next_action": "end"
# # # #         }

# # # """(modified – add structured output for final answer)
# # # We replace the branch that handles tool results with a structured generation step."""

# # # from langchain_ollama import ChatOllama
# # # from langchain_core.messages import AIMessage
# # # from langchain_core.output_parsers import PydanticOutputParser
# # # from state import State
# # # from schemas import FinalAnswer

# # # llm = ChatOllama(model="llama3.1", temperature=0)
# # # parser = PydanticOutputParser(pydantic_object=FinalAnswer)
# # # format_instructions = parser.get_format_instructions()

# # # def llm_node(state: State) -> dict:
# # #     conversation = state["messages"]
# # #     user_query = conversation[-1].content.lower()
    
# # #     # If last message is a tool result, generate structured final answer
# # #     if len(conversation) > 0 and "Tool result:" in conversation[-1].content:
# # #         # Prepare prompt asking for structured JSON
# # #         tool_result = conversation[-1].content
# # #         structured_prompt = f"""Based on the tool result below, provide a final answer in JSON format.
# # # {format_instructions}

# # # Tool result: {tool_result}
# # # User question: {user_query}
# # # Only output the JSON, no extra text.
# # # """
# # #         response = llm.invoke(structured_prompt)
# # #         try:
# # #             parsed = parser.parse(response.content)
# # #             answer_text = f"{parsed.answer}\n\nConfidence: {parsed.confidence}"
# # #             if parsed.sources:
# # #                 answer_text += f"\nSources: {', '.join(parsed.sources)}"
# # #             final_msg = AIMessage(content=answer_text)
# # #             return {
# # #                 "messages": conversation + [final_msg],
# # #                 "tool_calls": [],
# # #                 "next_action": "end"
# # #             }
# # #         except Exception as e:
# # #             # Fallback to plain text if parsing fails
# # #             final_msg = AIMessage(content=f"Answer: {response.content}")
# # #             return {
# # #                 "messages": conversation + [final_msg],
# # #                 "tool_calls": [],
# # #                 "next_action": "end"
# # #             }
    
# # #     # Rule‑based tool selection (unchanged)
# # #     keywords = ["contract", "regulation", "gdpr", "bond", "stock", "legal", "finance"]
# # #     if any(kw in user_query for kw in keywords):
# # #         tool_call = {"tool": "search_knowledge_base", "args": {"query": user_query}}
# # #         placeholder = AIMessage(content="[Calling knowledge base tool]")
# # #         return {
# # #             "messages": conversation + [placeholder],
# # #             "tool_calls": [tool_call],
# # #             "next_action": "call_tool"
# # #         }
# # #     else:
# # #         response = llm.invoke(conversation)
# # #         return {
# # #             "messages": conversation + [response],
# # #             "tool_calls": [],
# # #             "next_action": "end"
# # #         }

# # from langchain_ollama import ChatOllama
# # from langchain_core.messages import AIMessage
# # from state import State

# # llm = ChatOllama(model="llama3.1", temperature=0)

# # def llm_node(state: State) -> dict:
# #     conversation = state["messages"]
# #     user_query = conversation[-1].content.lower()
    
# #     # 1. If the last message is a tool result, generate final answer
# #     if len(conversation) > 0 and "Tool result:" in conversation[-1].content:
# #         tool_result = conversation[-1].content
# #         # Simple prompt – no JSON, just plain text
# #         prompt = f"""Use the following information to answer the user's question.
# # Do not mention the tool result explicitly. Answer naturally.

# # Tool result:
# # {tool_result}

# # User question: {user_query}

# # Answer:
# # """
# #         response = llm.invoke(prompt)
# #         final_msg = AIMessage(content=response.content)
# #         return {
# #             "messages": conversation + [final_msg],
# #             "tool_calls": [],
# #             "next_action": "end"
# #         }
    
# #     # 2. Decide whether to use the tool (based on keywords)
# #     keywords = ["contract", "regulation", "gdpr", "bond", "stock", "legal", "finance"]
# #     if any(kw in user_query for kw in keywords):
# #         tool_call = {"tool": "search_knowledge_base", "args": {"query": user_query}}
# #         placeholder = AIMessage(content="[Calling knowledge base tool]")
# #         return {
# #             "messages": conversation + [placeholder],
# #             "tool_calls": [tool_call],
# #             "next_action": "call_tool"
# #         }
    
# #     # 3. No tool needed – answer directly
# #     response = llm.invoke(conversation)
# #     return {
# #         "messages": conversation + [response],
# #         "tool_calls": [],
# #         "next_action": "end"
# #     }

# #llm_node.py with truncate logic 

# from langchain_ollama import ChatOllama
# from langchain_core.messages import AIMessage
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0)

# # Maximum number of messages to send to the LLM at once (adjust based on model's context window)
# MAX_LLM_CONTEXT = 6   # 3 user-assistant exchanges

# def llm_node(state: State) -> dict:
#     full_conversation = state["messages"]
#     user_query = full_conversation[-1].content.lower()
    
#     # 1. If the last message is a tool result, generate final answer
#     if len(full_conversation) > 0 and "Tool result:" in full_conversation[-1].content:
#         tool_result = full_conversation[-1].content
        
#         # For the final answer prompt, we still want to limit input size
#         # Keep only the most recent messages plus the tool result
#         if len(full_conversation) > MAX_LLM_CONTEXT:
#             truncated_context = full_conversation[-MAX_LLM_CONTEXT:]
#         else:
#             truncated_context = full_conversation
        
#         # Build a simple text prompt (truncated conversation is not directly used here)
#         # Instead, we just use the tool result and user query.
#         prompt = f"""Use the following information to answer the user's question.
# Do not mention the tool result explicitly. Answer naturally.

# Tool result:
# {tool_result}

# User question: {user_query}

# Answer:
# """
#         response = llm.invoke(prompt)
#         final_msg = AIMessage(content=response.content)
#         return {
#             "messages": full_conversation + [final_msg],
#             "tool_calls": [],
#             "next_action": "end"
#         }
    
#     # 2. Decide whether to use the tool (keyword‑based)
#     keywords = ["contract", "regulation", "gdpr", "bond", "stock", "legal", "finance"]
#     if any(kw in user_query for kw in keywords):
#         tool_call = {"tool": "search_knowledge_base", "args": {"query": user_query}}
#         placeholder = AIMessage(content="[Calling knowledge base tool]")
#         return {
#             "messages": full_conversation + [placeholder],
#             "tool_calls": [tool_call],
#             "next_action": "call_tool"
#         }
    
#     # 3. No tool needed – answer directly (truncate conversation before sending)
#     # Keep only the last MAX_LLM_CONTEXT messages to respect context window
#     if len(full_conversation) > MAX_LLM_CONTEXT:
#         truncated_messages = full_conversation[-MAX_LLM_CONTEXT:]
#     else:
#         truncated_messages = full_conversation
    
#     response = llm.invoke(truncated_messages)
#     return {
#         "messages": full_conversation + [response],
#         "tool_calls": [],
#         "next_action": "end"
#     }
from langchain_ollama import ChatOllama
from langchain_core.messages import AIMessage
from state import State

llm = ChatOllama(model="llama3.1", temperature=0)
MAX_LLM_CONTEXT = 6

def llm_node(state: State) -> dict:
    full_conversation = state["messages"]
    user_query = full_conversation[-1].content.lower()
    turn_id = state.get("turn_id", 0)
    
    # Tool result branch
    if len(full_conversation) > 0 and "Tool result:" in full_conversation[-1].content:
        tool_result = full_conversation[-1].content
        prompt = f"""Use the following information to answer the user's question.
Do not mention the tool result explicitly. Answer naturally.

Tool result:
{tool_result}

User question: {user_query}

Answer:
"""
        response = llm.invoke(prompt)
        final_msg = AIMessage(content=response.content)
        return {
            "messages": full_conversation + [final_msg],
            "tool_calls": [],
            "next_action": "end",
            "turn_id": turn_id
        }
    
    # Keyword tool selection
    keywords = ["contract", "regulation", "gdpr", "bond", "stock", "legal", "finance"]
    if any(kw in user_query for kw in keywords):
        tool_call = {"tool": "search_knowledge_base", "args": {"query": user_query}}
        placeholder = AIMessage(content="[Calling knowledge base tool]")
        return {
            "messages": full_conversation + [placeholder],
            "tool_calls": [tool_call],
            "next_action": "call_tool",
            "turn_id": turn_id
        }
    
    # Direct answer
    if len(full_conversation) > MAX_LLM_CONTEXT:
        truncated_messages = full_conversation[-MAX_LLM_CONTEXT:]
    else:
        truncated_messages = full_conversation
    response = llm.invoke(truncated_messages)
    return {
        "messages": full_conversation + [response],
        "tool_calls": [],
        "next_action": "end",
        "turn_id": turn_id
    }