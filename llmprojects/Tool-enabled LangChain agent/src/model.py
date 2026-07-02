from langchain_ollama import ChatOllama
from .config import MODEL_NAME

def get_llm():
    return ChatOllama(model=MODEL_NAME, temperature=0)