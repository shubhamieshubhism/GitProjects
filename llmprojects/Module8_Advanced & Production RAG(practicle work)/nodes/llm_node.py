# # from langchain_ollama import ChatOllama
# # from state import State

# # llm = ChatOllama(model="llama3.1", temperature=0)

# # def call_llm_node(state: State) -> dict:
# #     conversation = state["messages"]
# #     response = llm.invoke(conversation)
# #     return {"messages": conversation + [response]}

# from langchain_ollama import ChatOllama
# from langchain_core.prompts import ChatPromptTemplate
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0)

# def call_llm_node(state: State) -> dict:
#     conversation = state["messages"]
#     context = state.get("context", "No context retrieved.")
#     prompt = ChatPromptTemplate.from_messages([
#         ("system", "You are an enterprise assistant. Answer using the context below.\n\nContext:\n{context}"),
#         ("human", "{input}")
#     ])
#     last_user_msg = conversation[-1].content
#     formatted = prompt.format_messages(context=context, input=last_user_msg)
#     response = llm.invoke(formatted)
#     return {"messages": conversation + [response]}

from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from state import State

llm = ChatOllama(model="llama3.1", temperature=0)

def call_llm_node(state: State) -> dict:
    conversation = state["messages"]
    #context = state.get("context", "No context retrieved.")
    context = state.get("compressed_context") or state.get("context", "No context.")
    print(f"[LLM] Context being sent (first 300 chars):\n{context[:300]}...\n")  # <-- ADD
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an enterprise assistant. Answer using the context below.\n\nContext:\n{context}"),
        ("human", "{input}")
    ])
    last_user_msg = conversation[-1].content
    formatted = prompt.format_messages(context=context, input=last_user_msg)
    response = llm.invoke(formatted)
    return {"messages": conversation + [response]}