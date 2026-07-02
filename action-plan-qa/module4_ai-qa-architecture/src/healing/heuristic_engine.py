from typing import Optional
from src.common.llm_client import LLMClient

class HeuristicEngine:
    def __init__(self):
        self.llm = LLMClient()
        self.locator_priority = ["id", "name", "css", "xpath", "ai_healed"]

    def find_element(self, primary_locator: str, dom_state: str, screenshot: bytes = None) -> Optional[str]:
        # Primary locator would be tried in real code
        # For demo, we assume it fails and we run AI fallback
        return self._ai_fallback(primary_locator, dom_state, screenshot)

    def _ai_fallback(self, primary: str, dom: str, screenshot: bytes = None) -> Optional[str]:
        prompt = f"""
        The primary locator "{primary}" failed.
        Current DOM snapshot (truncated):
        {dom[:2000]}

        Provide the best alternative locator (CSS selector or XPath) that uniquely identifies the intended element.
        Return only the locator, no explanation.
        """
        response = self.llm.generate(prompt, max_tokens=100)
        return response.strip() if response.strip() else None