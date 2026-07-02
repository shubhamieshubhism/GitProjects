"""Wrapper for Ollama local LLM."""
from langchain_community.chat_models import ChatOllama
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class LocalLLM:
    """Ollama-based LLM."""

    def __init__(self, model: str = None, temperature: float = None):
        self.model = model or settings.ollama_model
        self.temperature = temperature if temperature is not None else settings.temperature
        self.llm = ChatOllama(
            model=self.model,
            base_url=settings.ollama_base_url,
            temperature=self.temperature
        )

    def invoke(self, prompt: str) -> str:
        """Call the local model and return content."""
        try:
            response = self.llm.invoke(prompt)
            return response.content
        except Exception as e:
            logger.error(f"Local LLM invocation failed: {e}")
            raise

    def __call__(self, prompt: str) -> str:
        return self.invoke(prompt)