from src.common.llm_client import LLMClient

class FailureClassifier:
    def __init__(self):
        self.llm = LLMClient()

    def classify(self, test_name: str, error: str, logs: str) -> dict:
        prompt = f"""
        Classify the following test failure into one of: genuine bug, flaky test, environment issue, test code issue, application change.
        Provide reasoning and confidence (0-100).

        Test: {test_name}
        Error: {error}
        Logs: {logs[:1000]}
        """
        response = self.llm.generate(prompt)
        # In real implementation, parse JSON from response
        return {
            "classification": "flaky_test",
            "reasoning": response,
            "confidence": 85
        }