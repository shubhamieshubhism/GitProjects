# src/model.py
from langchain_community.chat_models import ChatOllama
from .config import MODEL_NAME

def get_llm():
    """Return a configured ChatOllama instance running locally."""
    return ChatOllama(
        model=MODEL_NAME,
        temperature=0,
        num_predict=512   # limits output to 512 tokens (saves memory)
    )
