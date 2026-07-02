import os
from dotenv import load_dotenv

load_dotenv()

# For Ollama, we don't need an API key, but we'll keep this for consistency
def get_ollama_model() -> str:
    return os.getenv("OLLAMA_MODEL", "llama3.1")

def get_ollama_base_url() -> str:
    return os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")