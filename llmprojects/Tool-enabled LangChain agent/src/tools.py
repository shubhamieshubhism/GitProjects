# src/tools.py
from langchain_core.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun

# 1. Calculator tool
@tool
def calculate(expression: str) -> str:
    """
    Evaluate a mathematical expression.
    Use this when you need to do math.
    Example: calculate("25 * 4") returns "100"
    """
    try:
        # Safe evaluation (no dangerous functions)
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except Exception as e:
        return f"Math error: {e}"

# 2. Web search tool (wrapped as a tool)
@tool
def search_web(query: str) -> str:
    """
    Search the web for current information.
    Use this when you need up‑to‑date facts or general knowledge.
    Example: search_web("2022 World Cup winner")
    """
    try:
        search = DuckDuckGoSearchRun()
        return search.invoke(query)
    except Exception as e:
        return f"Search error: {e}"