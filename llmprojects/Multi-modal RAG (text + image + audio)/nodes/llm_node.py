# # # from langchain_ollama import ChatOllama
# # # from state import State

# # # llm = ChatOllama(model="llama3.1", temperature=0.7)

# # # def llm_node(state: State) -> dict:
# # #     conversation = state["messages"]
# # #     response = llm.invoke(conversation)
# # #     return {"messages": conversation + [response]}


# # from langchain_ollama import ChatOllama
# # from state import State

# # llm = ChatOllama(model="llama3.1", temperature=0.7)

# # def llm_node(state: State) -> dict:
# #     conversation = state["messages"]
# #     retrieved = state.get("retrieved_docs", [])
# #     print(f"[DEBUG] llm_node received retrieved_docs: {len(retrieved)} docs")
# #     if retrieved:
# #         print(f"[DEBUG] First doc: {retrieved[0][:150]}...")
# #     context = "\n\n".join(retrieved) if retrieved else "No relevant documents found."
# #     # Build a new message list with a system prompt containing the context
# #     system_msg = f"Use the following context to answer the user. If the context is not relevant, say so.\n\nContext:\n{context}"
# #     from langchain_core.messages import SystemMessage
# #     messages_with_context = [SystemMessage(content=system_msg)] + conversation
# #     response = llm.invoke(messages_with_context)
# #     return {"messages": conversation + [response]}

# from langchain_ollama import ChatOllama
# from langchain_core.messages import SystemMessage
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0.7)

# def llm_node(state: State) -> dict:
#     conversation = state["messages"]
#     retrieved = state.get("retrieved_docs", [])
#     image_caption = state.get("image_caption")
    
#     # Build context from all sources
#     context_parts = []
#     if retrieved:
#         context_parts.append("Retrieved documents:\n" + "\n\n".join(retrieved))
#     if image_caption:
#         context_parts.append(f"Image description: {image_caption}")
    
#     context = "\n\n".join(context_parts) if context_parts else "No additional context."
    
#     # Create system message with context
#     system_msg = SystemMessage(content=f"Use the following information to answer the user. If the context is irrelevant, say so.\n\nContext:\n{context}")
#     messages_with_context = [system_msg] + conversation
#     response = llm.invoke(messages_with_context)
#     return {"messages": conversation + [response]}

from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage
from state import State

llm = ChatOllama(model="llama3.1", temperature=0.7)

def llm_node(state: State) -> dict:
    conversation = state["messages"]
    retrieved = state.get("retrieved_docs", [])
    image_caption = state.get("image_caption")
    audio_transcript = state.get("audio_transcript")
    
    # Build context from all available modalities
    context_parts = []
    if retrieved:
        context_parts.append("Retrieved documents:\n" + "\n\n".join(retrieved))
    if image_caption:
        context_parts.append(f"Image description: {image_caption}")
    if audio_transcript:
        context_parts.append(f"Audio transcript: {audio_transcript}")
    
    context = "\n\n".join(context_parts) if context_parts else "No additional context."
    
    # Create system message with the combined context
    system_msg = SystemMessage(content=f"Use the following information to answer the user. If the context is irrelevant, say so.\n\nContext:\n{context}")
    messages_with_context = [system_msg] + conversation
    response = llm.invoke(messages_with_context)
    return {"messages": conversation + [response]}