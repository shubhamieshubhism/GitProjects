import yaml
import os

class PromptTemplates:
    def __init__(self):
        self.templates = {}
        self._load_templates()

    def _load_templates(self):
        """Load all prompt templates from YAML files."""
        prompt_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'prompts')
        files = {
            'fix_test': 'test_maintenance_prompts.yaml',
        }
        for key, filename in files.items():
            path = os.path.join(prompt_dir, filename)
            if os.path.exists(path):
                with open(path, 'r') as f:
                    data = yaml.safe_load(f)
                    self.templates[key] = data.get(key + '_prompt', '')
            else:
                # fallback to hardcoded
                self.templates[key] = self._fallback_prompt(key)

    def _fallback_prompt(self, key):
        # Minimal fallback if file missing
        return "Fix the test: {{test_code}} Error: {{error_log}}"

    def get_fix_prompt(self, test_code: str, error_log: str, app_context: str = "") -> str:
        template = self.templates.get('fix_test', '')
        return template.replace('{{test_code}}', test_code)\
                       .replace('{{error_log}}', error_log)\
                       .replace('{{app_context}}', app_context)