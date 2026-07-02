# from langchain_core.tools import tool
# import os

# @tool
# def web_search(query: str) -> str:
#     """
#     Search the web for current or general information. Use this for questions not answered by the handbook.
#     """
#     # Try Tavily if API key exists, else fallback to DuckDuckGo
#     tavily_key = os.getenv("TAVILY_API_KEY")
#     if tavily_key:
#         from langchain_community.tools.tavily_search import TavilySearchResults
#         search = TavilySearchResults(max_results=2, api_key=tavily_key)
#         results = search.invoke(query)
#         return "\n".join([f"Title: {r.get('title', '')}\nContent: {r.get('content', '')}" for r in results])
#     else:
#         from langchain_community.tools import DuckDuckGoSearchRun
#         search = DuckDuckGoSearchRun()
#         return search.invoke(query)


# from langchain_core.tools import tool

# @tool
# def web_search(query: str) -> str:
#     """
#     Search the web for general knowledge, current events, facts about geography, history, science, or any topic NOT covered in the company handbook.
#     Use this when the user asks about anything outside of company policies (vacation, VPN, expenses).
#     """
#     from langchain_community.tools import DuckDuckGoSearchRun
#     search = DuckDuckGoSearchRun()
#     try:
#         result = search.invoke(query)
#         return result if result else f"No results found for '{query}'."
#     except Exception as e:
#         return f"Search error: {str(e)}"


# tools/web_search.py
from langchain_core.tools import tool
import requests
import re
from urllib.parse import quote

# @tool
# def web_search(query: str) -> str:
#     """
#     Search the web for general knowledge. Use this for questions not in the handbook.
#     """
#     try:
#         url = f"https://lite.duckduckgo.com/lite/?q={quote(query)}"
#         headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
#         response = requests.get(url, headers=headers, timeout=15)
#         response.raise_for_status()
        
#         # DuckDuckGo Lite returns results in a simple table.
#         # Extract text from <tr> cells that contain results.
#         # Look for lines with result links (simplified).
#         results = re.findall(r'<tr class="result">.*?<a[^>]*>(.*?)</a>', response.text, re.DOTALL)
#         if results:
#             # Clean HTML tags
#             clean = [re.sub(r'<[^>]+>', '', r).strip() for r in results[:3]]
#             return "\n".join(clean)
#         else:
#             return f"No results found for '{query}'."
#     except Exception as e:
#         return f"Web search error: {str(e)}"

# from langchain_core.tools import tool
# import requests
# from urllib.parse import quote

# @tool
# def web_search(query: str) -> str:
#     """
#     Search the web for general knowledge. Use this for questions not in the handbook.
#     """
#     try:
#         url = f"https://api.duckduckgo.com/?q={quote(query)}&format=json&no_html=1&skip_disambig=1"
#         headers = {"User-Agent": "Mozilla/5.0"}
#         response = requests.get(url, headers=headers, timeout=10)
#         data = response.json()
#         abstract = data.get("AbstractText", "")
#         if abstract:
#             return abstract
#         # If no abstract, get first related topic
#         related = data.get("RelatedTopics", [])
#         if related and isinstance(related, list):
#             first = related[0].get("Text", "")
#             if first:
#                 return first
#         return f"No results found for '{query}'."
#     except Exception as e:
#         return f"Web search error: {str(e)}"

# from langchain_core.tools import tool
# import requests
# from urllib.parse import quote

# @tool
# def web_search(query: str) -> str:
#     """
#     Search the web for general knowledge. Use this for questions not in the handbook.
#     """
#     try:
#         # Use the DuckDuckGo "instant answer" API (returns abstract)
#         url = f"https://api.duckduckgo.com/?q={quote(query)}&format=json&no_html=1&skip_disambig=1&t=h_"
#         headers = {"User-Agent": "Mozilla/5.0"}
#         response = requests.get(url, headers=headers, timeout=10)
#         response.raise_for_status()
#         data = response.json()
        
#         # Try to get the abstract text
#         abstract = data.get("AbstractText", "")
#         if abstract:
#             return abstract
        
#         # If no abstract, try the first related topic
#         related = data.get("RelatedTopics", [])
#         for topic in related:
#             if isinstance(topic, dict) and "Text" in topic:
#                 return topic["Text"]
        
#         # Fallback to the answer field (for direct answers)
#         answer = data.get("Answer", "")
#         if answer:
#             return answer
        
#         # Finally, try the definition
#         definition = data.get("Definition", "")
#         if definition:
#             return definition
        
#         return f"I couldn't find a reliable answer for '{query}'. Please try a different query."
#     except Exception as e:
#         return f"Web search error: {str(e)}"

# from langchain_core.tools import tool
# import requests
# from urllib.parse import quote

# @tool
# def web_search(query: str) -> str:
#     """
#     Search the web for general knowledge. Use this for questions not in the handbook.
#     """
#     # Try Wikipedia first (good for factual questions like capital of France)
#     try:
#         # Format query for Wikipedia (replace spaces with underscores)
#         wiki_query = query.replace(' ', '_')
#         url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote(wiki_query)}"
#         headers = {"User-Agent": "Mozilla/5.0"}
#         response = requests.get(url, headers=headers, timeout=10)
#         if response.status_code == 200:
#             data = response.json()
#             if "extract" in data:
#                 return data["extract"]
#     except Exception:
#         pass

#     # Fallback to DuckDuckGo API
#     try:
#         ddg_url = f"https://api.duckduckgo.com/?q={quote(query)}&format=json&no_html=1&skip_disambig=1"
#         response = requests.get(ddg_url, headers=headers, timeout=10)
#         data = response.json()
#         abstract = data.get("AbstractText")
#         if abstract:
#             return abstract
#         answer = data.get("Answer")
#         if answer:
#             return answer
#         definition = data.get("Definition")
#         if definition:
#             return definition
#         # Try related topics
#         related = data.get("RelatedTopics", [])
#         for topic in related:
#             if isinstance(topic, dict) and "Text" in topic:
#                 return topic["Text"]
#         return f"Could not find information for '{query}'."
#     except Exception as e:
#         return f"Web search error: {str(e)}"

from langchain_core.tools import tool
import requests
from urllib.parse import quote

@tool
def web_search(query: str) -> str:
    """Search the web for general knowledge, capitals, news, etc."""
    # Use Wikipedia API
    wiki_query = query.replace(' ', '_')
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote(wiki_query)}"
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if "extract" in data:
                return data["extract"]
    except:
        pass
    return f"Could not find information for '{query}'."