"""Wrapper for OpenAI LLM as fallback."""
from langchain_openai import ChatOpenAI
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class OpenAILLM:
    """OpenAI‑based LLM."""

    def __init__(self, model: str = None, temperature: float = None):
        self.model = model or settings.openai_model
        self.temperature = temperature if temperature is not None else settings.temperature
        self.api_key = settings.openai_api_key
        if not self.api_key:
            raise ValueError("OpenAI API key is missing. Set OPENAI_API_KEY in .env")
        self.llm = ChatOpenAI(
            model=self.model,
            api_key=self.api_key,
            temperature=self.temperature
        )

    def invoke(self, prompt: str) -> str:
        """Call OpenAI and return content."""
        try:
            response = self.llm.invoke(prompt)
            return response.content
        except Exception as e:
            logger.error(f"OpenAI invocation failed: {e}")
            raise

    def __call__(self, prompt: str) -> str:
        return self.invoke(prompt)