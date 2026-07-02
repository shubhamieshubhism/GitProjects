# from langchain_community.chat_models import ChatOllama
# from langchain_core.messages import SystemMessage
# from state import State
# from tools import draft_email

# # Load system prompt
# with open("prompts/system_prompt.txt", "r") as f:
#     SYSTEM_PROMPT = f.read()

# # Initialize LLM and bind the tool
# llm = ChatOllama(model="llama3", temperature=0)
# llm_with_tools = llm.bind_tools([draft_email])

# def call_llm_node(state: State) -> dict:
#     messages = state["messages"]
#     # Ensure system prompt is at the beginning
#     if not messages or not isinstance(messages[0], SystemMessage):
#         messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
    
#     response = llm_with_tools.invoke(messages)
    
#     # Check if the response contains a tool call
#     if hasattr(response, "tool_calls") and response.tool_calls:
#         # There's a tool request
#         return {
#             "messages": [response],
#             "next_action": "call_tool",
#             "tool_calls": response.tool_calls
#         }
#     else:
#         # No tool, just final answer
#         return {
#             "messages": [response],
#             "next_action": "end",
#             "final_answer": response.content
#         }

from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage
from state import State
from tools import draft_email, send_email, search_emails
from utils.config import get_ollama_model, get_ollama_base_url

# Load system prompt
with open("prompts/system_prompt.txt", "r") as f:
    SYSTEM_PROMPT = f.read()

# Initialize Ollama LLM and bind all three tools
llm = ChatOllama(
    model=get_ollama_model(),
    base_url=get_ollama_base_url(),
    temperature=0
)
llm_with_tools = llm.bind_tools([draft_email, send_email, search_emails])

def call_llm_node(state: State) -> dict:
    messages = state["messages"]
    if not messages or not isinstance(messages[0], SystemMessage):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
    
    response = llm_with_tools.invoke(messages)
    
    if hasattr(response, "tool_calls") and response.tool_calls:
        return {
            "messages": [response],
            "next_action": "call_tool",
            "tool_calls": response.tool_calls
        }
    else:
        return {
            "messages": [response],
            "next_action": "end",
            "final_answer": response.content
        }