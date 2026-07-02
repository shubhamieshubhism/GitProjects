# # # from langchain_ollama import ChatOllama
# # # from state import State

# # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # def call_llm_node(state: State) -> dict:
# # #     conversation = state["messages"]
# # #     response = llm.invoke(conversation)
# # #     # Append the new AI message to the list
# # #     return {"messages": conversation + [response]}

# # from langchain_ollama import ChatOllama
# # from langchain_core.prompts import ChatPromptTemplate
# # from state import State

# # llm = ChatOllama(model="llama3.1", temperature=0)

# # def llm_node(state: State) -> dict:
# #     conversation = state["messages"]
# #     context = state.get("context", "No context available.")
    
# #     prompt = ChatPromptTemplate.from_messages([
# #         ("system", "Answer using the context below if relevant.\n\nContext:\n{context}"),
# #         ("human", "{input}")
# #     ])
# #     last_user_msg = conversation[-1].content
# #     formatted = prompt.format_messages(context=context, input=last_user_msg)
# #     response = llm.invoke(formatted)
# #     return {"messages": conversation + [response]}

# from langchain_ollama import ChatOllama
# from langchain_core.prompts import ChatPromptTemplate
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0)

# def llm_node(state: State) -> dict:
#     conversation = state["messages"]
#     context = state.get("context", "No context retrieved.")
#     prompt = ChatPromptTemplate.from_messages([
#         ("system", "You are a Harry Potter expert. Answer using the context.\n\nContext:\n{context}"),
#         ("human", "{input}")
#     ])
#     last_user_msg = conversation[-1].content
#     formatted = prompt.format_messages(context=context, input=last_user_msg)
#     response = llm.invoke(formatted)
#     return {"messages": conversation + [response]}

from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from state import State
from tenacity import retry, stop_after_attempt, wait_exponential

llm = ChatOllama(model="llama3.1", temperature=0)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def call_llm_with_retry(messages):
    return llm.invoke(messages)

def llm_node(state: State) -> dict:
    conversation = state["messages"]
    context = state.get("context", "No context retrieved.")
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a Harry Potter expert. Answer using the context.\n\nContext:\n{context}"),
        ("human", "{input}")
    ])
    last_user_msg = conversation[-1].content
    formatted = prompt.format_messages(context=context, input=last_user_msg)
    try:
        response = call_llm_with_retry(formatted)
        return {
            "messages": conversation + [response],
            "error_count": 0,
            "error_message": ""
        }
    except Exception as e:
        error_count = state.get("error_count", 0) + 1
        if error_count >= 3:
            return {
                "error_count": error_count,
                "error_message": str(e),
                "next_node": "fallback"
            }
        else:
            raise