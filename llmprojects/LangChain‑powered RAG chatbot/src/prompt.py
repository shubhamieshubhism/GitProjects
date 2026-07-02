# src/prompt.py
# from langchain_core.prompts import ChatPromptTemplate

# def get_prompt():
#     """Return a prompt template for RAG."""
#     return ChatPromptTemplate.from_messages([
#         ("system", "You are a helpful assistant. Answer the question using ONLY the context below. If the answer is not in the context, say 'I don't know'."),
#         ("human", "Context: {context}\n\nQuestion: {question}")
#     ])

# src/prompt.py (updated)
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

def get_prompt():
    """Return a prompt template for RAG with memory."""
    return ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant. Answer the question using ONLY the context below. If the answer is not in the context, say 'I don't know'."),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "Context: {context}\n\nQuestion: {question}")
    ])