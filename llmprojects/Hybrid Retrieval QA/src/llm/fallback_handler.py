from langchain_community.chat_models import ChatOllama
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableLambda
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class LLMWithFallback:
    def __init__(self):
        self.primary = ChatOllama(
            model=settings.ollama_model,
            base_url=settings.ollama_base_url,
            temperature=settings.temperature
        )
        self.fallback = ChatOpenAI(
            model=settings.openai_model,
            api_key=settings.openai_api_key,
            temperature=settings.temperature
        )

    def __call__(self, prompt):
        try:
            return self.primary.invoke(prompt).content
        except Exception as e:
            logger.warning(f"Local LLM failed: {e}. Falling back to OpenAI.")
            if not settings.openai_api_key:
                raise RuntimeError("OpenAI API key missing and local LLM failed.")
            return self.fallback.invoke(prompt).content

# Wrap as LangChain Runnable
llm_runnable = RunnableLambda(LLMWithFallback())