# # from langchain_ollama import ChatOllama
# # from state import State

# # llm = ChatOllama(model="llama3.1", temperature=0)

# # def call_llm_node(state: State) -> dict:
# #     """Send the conversation to Ollama and return the AI reply."""
# #     conversation = state["messages"]
# #     response = llm.invoke(conversation)
# #     # Append the new AI message to the list
# #     return {"messages": conversation + [response]}

# from langchain_ollama import ChatOllama
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0)

# def call_llm_node(state: State) -> dict:
#     conversation = state["messages"]
#     response = llm.invoke(conversation)
#     # Simulate tool detection: if response contains "search", go to tool
#     next_node = "mock_tool" if "search" in response.content.lower() else "end"
#     return {
#         "messages": conversation + [response],
#         "next_node": next_node
#     }

# from langchain_ollama import ChatOllama
# from state import State
# from tenacity import retry, stop_after_attempt, wait_exponential

# llm = ChatOllama(model="llama3.1", temperature=0)

# @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
# def call_llm_with_retry(messages):
#     return llm.invoke(messages)

# def call_llm_node(state: State) -> dict:
#     try:
#         conversation = state["messages"]
#         response = call_llm_with_retry(conversation)
#         next_node = "mock_tool" if "search" in response.content.lower() else "end"
#         return {
#             "messages": conversation + [response],
#             "next_node": next_node,
#             "error_count": 0,
#             "error_message": ""
#         }
#     except Exception as e:
#         error_count = state.get("error_count", 0) + 1
#         if error_count >= 3:
#             return {
#                 "next_node": "fallback",
#                 "error_count": error_count,
#                 "error_message": str(e)
#             }
#         else:
#             # Re-raise to let retry happen
#             raise


# from langchain_ollama import ChatOllama
# from state import State
# from tenacity import retry, stop_after_attempt, wait_exponential

# llm = ChatOllama(model="llama3.1", temperature=0)

# @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
# def call_llm_with_retry(messages):
#     return llm.invoke(messages)

# def call_llm_node(state: State) -> dict:
#     try:
#         conversation = state["messages"]
#         response = call_llm_with_retry(conversation)
        
#         # --- MODIFICATION START ---
#         # Use the user's last message (not the LLM's response) to decide approval
#         user_query = conversation[-1].content
#         if "search" in user_query.lower():
#             next_node = "await_approval"
#         else:
#             next_node = "end"
#         # --- MODIFICATION END ---

#         print(f"[DEBUG llm_node] user_query: {user_query}")
#         print(f"[DEBUG llm_node] next_node = {next_node}")   # <-- ADD THIS
        
#         return {
#             "messages": conversation + [response],
#             "next_node": next_node,
#             "error_count": 0,
#             "error_message": ""
#         }
#     except Exception as e:
#         error_count = state.get("error_count", 0) + 1
#         if error_count >= 3:
#             return {
#                 "next_node": "fallback",
#                 "error_count": error_count,
#                 "error_message": str(e)
#             }
#         else:
#             # Re-raise to let retry happen
#             raise

from langchain_ollama import ChatOllama
from state import State
from tenacity import retry, stop_after_attempt, wait_exponential

llm = ChatOllama(model="llama3.1", temperature=0)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def call_llm_with_retry(messages):
    return llm.invoke(messages)

def call_llm_node(state: State) -> dict:
    try:
        conversation = state["messages"]
        response = call_llm_with_retry(conversation)
        # No routing logic – just return the updated conversation
        return {
            "messages": conversation + [response],
            "error_count": 0,
            "error_message": ""
        }
    except Exception as e:
        error_count = state.get("error_count", 0) + 1
        if error_count >= 3:
            # If you have a fallback node, you can include 'next_node': 'fallback'
            return {
                "error_count": error_count,
                "error_message": str(e)
            }
        else:
            raise