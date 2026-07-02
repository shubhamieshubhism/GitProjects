import math
import re

def calculate(expression: str) -> str:
    """
    Safely evaluate a mathematical expression.
    Supports +, -, *, /, **, sqrt(), sin(), cos(), etc.
    """
    # Remove any potentially dangerous characters (allow only math)
    if not re.match(r'^[0-9+\-*/().% sqrt sin cos tan log]+$', expression):
        return "Error: Invalid characters in expression."
    
    try:
        # Use a restricted namespace
        allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
        allowed_names.update({"abs": abs, "round": round})
        # Evaluate
        result = eval(expression, {"__builtins__": {}}, allowed_names)
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {str(e)}"