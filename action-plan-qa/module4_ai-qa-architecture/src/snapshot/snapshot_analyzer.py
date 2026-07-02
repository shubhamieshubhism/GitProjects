from src.common.llm_client import LLMClient

class SnapshotAnalyzer:
    def __init__(self):
        self.llm = LLMClient()

    def compare(self, baseline: dict, current: dict, screenshot_b64: str = None) -> dict:
        prompt = f"""
        Compare the baseline DOM snapshot and the current DOM snapshot.
        Determine if changes are:
        - Intentional (UI redesign, content update)
        - A bug (unexpected layout break, missing element)
        - No meaningful change (test is flaky)

        Provide a classification and explanation.

        Baseline DOM: {baseline}
        Current DOM: {current}
        """
        if screenshot_b64:
            prompt += f"\nScreenshot (base64) provided."
        response = self.llm.generate(prompt, images=[screenshot_b64] if screenshot_b64 else None)
        return {"classification": "intentional", "explanation": response}