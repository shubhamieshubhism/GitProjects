from langchain_core.tools import tool
import os

@tool
def web_search(query: str) -> str:
    """
    Search the web for current or general information. Use this when the handbook doesn't contain the answer.
    """
    # Try Tavily first if API key is present
    tavily_key = os.getenv("TAVILY_API_KEY")
    if tavily_key:
        from langchain_community.tools.tavily_search import TavilySearchResults
        search = TavilySearchResults(max_results=2, api_key=tavily_key)
        results = search.invoke(query)
        # Format results as a single string
        return "\n".join([f"Title: {r.get('title', '')}\nContent: {r.get('content', '')}" for r in results])
    else:
        # Fallback to DuckDuckGo (no API key needed)
        from langchain_community.tools import DuckDuckGoSearchRun
        search = DuckDuckGoSearchRun()
        return search.invoke(query)