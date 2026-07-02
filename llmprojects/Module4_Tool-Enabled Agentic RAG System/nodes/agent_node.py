# # # from langchain_ollama import ChatOllama
# # # from state import State
# # # from tools import handbook_tool

# # # llm = ChatOllama(model="llama3.1", temperature=0)
# # # llm_with_tools = llm.bind_tools([handbook_tool])

# # # def agent_node(state: State) -> dict:
# # #     conversation = state["messages"]
# # #     response = llm_with_tools.invoke(conversation)
    
# # #     if hasattr(response, "tool_calls") and response.tool_calls:
# # #         return {
# # #             "messages": [response],
# # #             "next_action": "call_tool",
# # #             "tool_calls": response.tool_calls
# # #         }
# # #     else:
# # #         return {
# # #             "messages": [response],
# # #             "next_action": "end",
# # #             "final_answer": response.content
# # #         }

# # from langchain_ollama import ChatOllama
# # from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# # from state import State
# # from tools import handbook_tool, web_search

# # llm = ChatOllama(model="llama3.1", temperature=0)
# # #llm_with_tools = llm.bind_tools([handbook_tool])
# # # In agent_node.py, change the bind_tools line to:
# # llm_with_tools = llm.bind_tools([handbook_tool, web_search])

# # # Prompt that includes conversation history
# # prompt = ChatPromptTemplate.from_messages([
# #     ("system", "You are a helpful assistant with access to a handbook search tool. Use it when needed. Answer concisely."),
# #     MessagesPlaceholder(variable_name="chat_history"),
# #     ("human", "{input}"),
# #     MessagesPlaceholder(variable_name="agent_scratchpad")
# # ])

# # def agent_node(state: State) -> dict:
# #     # Extract conversation history (all messages except the last user message)
# #     messages = state["messages"]
# #     # The last message is the current user input; the rest is history
# #     chat_history = messages[:-1]
# #     current_input = messages[-1].content

# #     # Invoke the LLM with the prompt
# #     response = llm_with_tools.invoke(
# #         prompt.format_messages(
# #             chat_history=chat_history,
# #             input=current_input,
# #             agent_scratchpad=[]  # for future tool call scratchpad
# #         )
# #     )
    
# #     if hasattr(response, "tool_calls") and response.tool_calls:
# #         return {
# #             "messages": [response],
# #             "next_action": "call_tool",
# #             "tool_calls": response.tool_calls
# #         }
# #     else:
# #         return {
# #             "messages": [response],
# #             "next_action": "end",
# #             "final_answer": response.content
# #         }



# from langchain_ollama import ChatOllama
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from state import State
# from tools import handbook_tool, web_search
# import re

# llm = ChatOllama(model="llama3.1", temperature=0)

# # ReAct prompt that forces tool calling format
# react_prompt = ChatPromptTemplate.from_messages([
#     ("system", """You are a helpful assistant with access to these tools:

# 1. handbook_search(query: str) - Search the company handbook for policies on vacation, VPN, expenses.
# 2. web_search(query: str) - Search the web for general knowledge, capitals, news, etc.

# To use a tool, output:
# Action: tool_name
# Action Input: the query

# After receiving the tool result, output:
# Final Answer: your answer

# If no tool is needed, output:
# Final Answer: your answer directly.

# Now answer the user's question."""),
#     MessagesPlaceholder(variable_name="chat_history"),
#     ("human", "{input}"),
#     ("assistant", "{agent_scratchpad}")
# ])

# def agent_node(state: State) -> dict:
#     messages = state["messages"]
#     chat_history = messages[:-1]
#     current_input = messages[-1].content
    
#     # We'll use a simple scratchpad to store the last thought/action
#     scratchpad = state.get("scratchpad", "")
    
#     formatted = react_prompt.format_messages(
#         chat_history=chat_history,
#         input=current_input,
#         agent_scratchpad=scratchpad
#     )
#     response = llm.invoke(formatted)
#     response_text = response.content
    
#     # Parse for Action/Action Input
#     action_match = re.search(r"Action:\s*(\w+)\s+Action Input:\s*(.+)", response_text, re.IGNORECASE)
#     if action_match:
#         tool_name = action_match.group(1).strip()
#         tool_input = action_match.group(2).strip().strip('"')
#         return {
#             "messages": [response],
#             "next_action": "call_tool",
#             "tool_calls": [{"name": tool_name, "args": {"query": tool_input}}],
#             "scratchpad": scratchpad + response_text + "\n"
#         }
#     else:
#         # No tool call – final answer
#         return {
#             "messages": [response],
#             "next_action": "end",
#             "final_answer": response_text
#         }

from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from state import State

llm = ChatOllama(model="llama3.1", temperature=0)

# Simple ReAct prompt
react_prompt = PromptTemplate.from_template("""You have two tools:
1. handbook_search(query) - for company policies
2. web_search(query) - for general knowledge

To use a tool, respond with:
Action: tool_name
Action Input: query

When you have the final answer, respond with:
Final Answer: your answer

Conversation history:
{chat_history}

User: {input}
{agent_scratchpad}""")

def agent_node(state: State) -> dict:
    messages = state["messages"]
    # Build chat history string
    chat_history = "\n".join([f"{msg.type}: {msg.content}" for msg in messages[:-1]])
    current_input = messages[-1].content
    scratchpad = state.get("scratchpad", "")
    prompt = react_prompt.format(chat_history=chat_history, input=current_input, agent_scratchpad=scratchpad)
    response = llm.invoke(prompt)
    content = response.content

    # Parse action
    if "Action:" in content and "Action Input:" in content:
        lines = content.split("\n")
        action = None
        action_input = None
        for line in lines:
            if line.startswith("Action:"):
                action = line.replace("Action:", "").strip()
            if line.startswith("Action Input:"):
                action_input = line.replace("Action Input:", "").strip()
        if action and action_input:
            return {
                "messages": [response],
                "next_action": "call_tool",
                "tool_calls": [{"name": action, "args": {"query": action_input}}],
                "scratchpad": scratchpad + content + "\n"
            }
    # No action -> final answer
    return {
        "messages": [response],
        "next_action": "end",
        "final_answer": content,
        "scratchpad": scratchpad + content + "\n"
    }