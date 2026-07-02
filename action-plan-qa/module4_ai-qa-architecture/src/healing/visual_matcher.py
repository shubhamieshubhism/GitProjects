import base64
from typing import Optional
from src.common.llm_client import LLMClient

class VisualMatcher:
    def __init__(self):
        self.llm = LLMClient()

    def match(self, screenshot_b64: str, original_locator: str) -> Optional[str]:
        prompt = f"""
        Using the provided screenshot, find the element that corresponds to the locator: "{original_locator}".
        Return the best CSS selector or XPath that would uniquely identify this element.
        If you cannot find it, return "None".
        """
        response = self.llm.generate(prompt, images=[screenshot_b64])
        result = response.strip()
        return result if result != "None" else None