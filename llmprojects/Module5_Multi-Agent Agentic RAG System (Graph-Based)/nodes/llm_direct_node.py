from langchain_ollama import ChatOllama
from state import State

llm = ChatOllama(model="llama3.1", temperature=0)

def llm_direct_node(state: State) -> dict:
    conversation = state["messages"]
    response = llm.invoke(conversation)
    return {"messages": conversation + [response]}