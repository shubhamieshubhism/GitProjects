# from langchain_ollama import ChatOllama
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0)  # make sure you have this model

# def call_llm_node(state: State) -> dict:
#     """Send the conversation to Ollama and return the AI reply."""
#     conversation = state["messages"]
#     response = llm.invoke(conversation)
#     # Append the new AI message to the existing list
#     return {"messages": conversation + [response]}

from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from state import State

llm = ChatOllama(model="llama3.1", temperature=0)

def call_llm_node(state: State) -> dict:
    conversation = state["messages"]
    context = state.get("context", "No context available.")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant. Answer the user's question using the context below if it is relevant.\n\nContext:\n{context}"),
        ("human", "{input}")
    ])
    last_user_msg = conversation[-1].content
    formatted = prompt.format_messages(context=context, input=last_user_msg)
    response = llm.invoke(formatted)
    return {"messages": conversation + [response]}