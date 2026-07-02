import logging
import json
from typing import Dict, Any, List
from src.common.llm_client import LLMClient
from .prompt_templates import PromptTemplates
from .fix_engine import FixEngine

logger = logging.getLogger(__name__)

class TestMaintenanceAgent:
    def __init__(self):
        self.llm = LLMClient()
        self.prompts = PromptTemplates()
        self.fix_engine = FixEngine()
        self.fix_history = []

    def analyze_and_fix(self, test_code: str, error_log: str, app_context: str = "") -> Dict[str, Any]:
        prompt = self.prompts.get_fix_prompt(test_code, error_log, app_context)
        response = self.llm.generate(prompt, max_tokens=2000)
        proposal = self._parse_response(response)

        validated_fixes = []
        for fix in proposal.get("fixes", []):
            fixed_code = fix.get("fixed_code")
            valid = self._validate_fix(fixed_code)
            if valid:
                validated_fixes.append(fix)
        if validated_fixes:
            best = max(validated_fixes, key=lambda x: x.get("confidence", 0))
            self.fix_history.append({
                "original": test_code,
                "fixed": best["fixed_code"],
                "root_cause": proposal.get("root_cause"),
                "confidence": best["confidence"]
            })
            return {
                "root_cause": proposal.get("root_cause"),
                "fixes": validated_fixes,
                "best_fix": best,
                "explanation": proposal.get("explanation")
            }
        else:
            return {
                "error": "No valid fix found",
                "root_cause": proposal.get("root_cause")
            }

    def _parse_response(self, response: str) -> Dict[str, Any]:
        try:
            if "```json" in response:
                start = response.index("```json") + 7
                end = response.index("```", start)
                json_str = response[start:end].strip()
            else:
                json_str = response.strip()
            return json.loads(json_str)
        except Exception:
            return {"root_cause": "unknown", "fixes": [], "explanation": response}

    def _validate_fix(self, code: str) -> bool:
        # Basic syntax check – in real implementation use ast.parse
        try:
            compile(code, '<string>', 'exec')
            return True
        except SyntaxError:
            return False