# import os
# from dotenv import load_dotenv

# load_dotenv()

# def get_model_provider():
#     return os.getenv("MODEL_PROVIDER", "ollama").lower()

# def get_llm():
#     provider = get_model_provider()
#     if provider == "openai":
#         from langchain_openai import ChatOpenAI
#         return ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
#     else:
#         from langchain_community.chat_models import ChatOllama
#         return ChatOllama(model=os.getenv("OLLAMA_MODEL", "llama3.1"), temperature=0)

# def get_embeddings():
#     provider = get_model_provider()
#     if provider == "openai":
#         from langchain_openai import OpenAIEmbeddings
#         return OpenAIEmbeddings()
#     else:
#         from langchain_community.embeddings import OllamaEmbeddings
#         return OllamaEmbeddings(model=os.getenv("OLLAMA_EMBEDDINGS", "nomic-embed-text"))

# import os
# from dotenv import load_dotenv

# load_dotenv()

# def get_model_provider():
#     return os.getenv("MODEL_PROVIDER", "ollama").lower()

# def get_llm():
#     provider = get_model_provider()
#     if provider == "openai":
#         from langchain_openai import ChatOpenAI
#         return ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
#     else:
#         from langchain_ollama import ChatOllama  # Changed from langchain_community
#         return ChatOllama(
#             model=os.getenv("OLLAMA_MODEL", "llama3.1"),
#             temperature=0,
#             # Optionally add: base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
#         )

# def get_embeddings():
#     provider = get_model_provider()
#     if provider == "openai":
#         from langchain_openai import OpenAIEmbeddings
#         return OpenAIEmbeddings()
#     else:
#         from langchain_ollama import OllamaEmbeddings  # Changed from langchain_community
#         return OllamaEmbeddings(
#             model=os.getenv("OLLAMA_EMBEDDINGS", "nomic-embed-text")
#         )

import os
from dotenv import load_dotenv

load_dotenv()

def get_model_provider():
    return os.getenv("MODEL_PROVIDER", "ollama").lower()

def get_llm():
    provider = get_model_provider()
    if provider == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
    else:
        from langchain_ollama import ChatOllama   # Note: langchain_ollama, not langchain_community
        return ChatOllama(
            model=os.getenv("OLLAMA_MODEL", "llama3.1"),
            temperature=0,
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        )

def get_embeddings():
    provider = get_model_provider()
    if provider == "openai":
        from langchain_openai import OpenAIEmbeddings
        return OpenAIEmbeddings()
    else:
        from langchain_ollama import OllamaEmbeddings   # Note: langchain_ollama
        return OllamaEmbeddings(
            model=os.getenv("OLLAMA_EMBEDDINGS", "nomic-embed-text")
        )