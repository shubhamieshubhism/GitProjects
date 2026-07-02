# src/memory.py
from langchain.memory import ConversationBufferWindowMemory

def create_memory(k=3):
    """Create a memory that keeps the last k exchanges."""
    return ConversationBufferWindowMemory(
        k=k,
        return_messages=True,
        memory_key="chat_history"
    )