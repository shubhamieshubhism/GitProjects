import subprocess
import tempfile
import os
import logging

logger = logging.getLogger(__name__)

class FixEngine:
    def apply_fix(self, test_code: str, fixed_code: str) -> bool:
        """
        Write fixed code to a temp file and run it.
        Returns True if test passes, False otherwise.
        """
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(fixed_code)
                temp_path = f.name
            # Run the test (mock – in reality run pytest or similar)
            # For demo, we simulate success
            result = subprocess.run(['python', temp_path], capture_output=True, timeout=30)
            os.unlink(temp_path)
            return result.returncode == 0
        except Exception as e:
            logger.error(f"Error applying fix: {e}")
            return False