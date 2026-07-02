# # # # # # # # # # from langchain_ollama import ChatOllama
# # # # # # # # # # from state import State

# # # # # # # # # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # # # # # # # def llm_node(state: State) -> dict:
# # # # # # # # # #     conversation = state["messages"]
# # # # # # # # # #     response = llm.invoke(conversation)
# # # # # # # # # #     # Append the new AI message to the list
# # # # # # # # # #     return {"messages": conversation + [response]}

# # # # # # # # # """We will use no special classes – we will implement the logic ourselves using json and custom parsing.

# # # # # # # # # Module	Import	Purpose
# # # # # # # # # json	import json	Parse LLM output.
# # # # # # # # # re (optional)	import re	Extract JSON from text."""




# # # # # # # # # from langchain_ollama import ChatOllama
# # # # # # # # # from state import State
# # # # # # # # # import json

# # # # # # # # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # # # # # # # System prompt that forces JSON output
# # # # # # # # # SYSTEM_PROMPT = """You are a helpful assistant. If the user asks about weather, you must output:
# # # # # # # # # {"tool": "get_weather", "args": {"city": "city_name"}}
# # # # # # # # # Otherwise, answer directly in natural language.
# # # # # # # # # Output only the JSON or the natural language answer, no extra text.
# # # # # # # # # """

# # # # # # # # # def llm_node(state: State) -> dict:
# # # # # # # # #     conversation = state["messages"]
# # # # # # # # #     # Prepend system prompt if not already there
# # # # # # # # #     if not conversation or conversation[0].content != SYSTEM_PROMPT:
# # # # # # # # #         from langchain_core.messages import SystemMessage
# # # # # # # # #         conversation = [SystemMessage(content=SYSTEM_PROMPT)] + conversation
    
# # # # # # # # #     response = llm.invoke(conversation)
# # # # # # # # #     response_text = response.content.strip()
    
# # # # # # # # #     # Try to parse as JSON
# # # # # # # # #     try:
# # # # # # # # #         tool_call = json.loads(response_text)
# # # # # # # # #         if "tool" in tool_call and "args" in tool_call:
# # # # # # # # #             return {
# # # # # # # # #                 "messages": conversation + [response],
# # # # # # # # #                 "tool_calls": [tool_call],
# # # # # # # # #                 "next_action": "call_tool"
# # # # # # # # #             }
# # # # # # # # #     except json.JSONDecodeError:
# # # # # # # # #         # Not JSON – natural language answer
# # # # # # # # #         pass
    
# # # # # # # # #     # Natural language answer
# # # # # # # # #     return {
# # # # # # # # #         "messages": conversation + [response],
# # # # # # # # #         "tool_calls": [],
# # # # # # # # #         "next_action": "end"
# # # # # # # # #     }

# # # # # # # # """Update nodes/llm_node.py
# # # # # # # # Replace the SYSTEM_PROMPT with a more explicit instruction, and add a fallback when JSON parsing fails or the tool is unknown."""


# # # # # # # # from langchain_ollama import ChatOllama
# # # # # # # # from state import State
# # # # # # # # import json

# # # # # # # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # # # # # SYSTEM_PROMPT = """You are a helpful assistant. You have ONE tool: get_weather.
# # # # # # # # - If the user asks for weather in a city, respond ONLY with the JSON: {"tool": "get_weather", "args": {"city": "city_name"}}
# # # # # # # # - For ANY other question (including capital cities, general knowledge, etc.), respond with a natural language answer. Do NOT output JSON.

# # # # # # # # Examples:
# # # # # # # # User: "What is the weather in Paris?" → {"tool": "get_weather", "args": {"city": "Paris"}}
# # # # # # # # User: "What is the capital of France?" → The capital of France is Paris.
# # # # # # # # User: "Hello" → Hello! How can I help you?

# # # # # # # # Now respond appropriately.
# # # # # # # # """

# # # # # # # # def llm_node(state: State) -> dict:
# # # # # # # #     conversation = state["messages"]
# # # # # # # #     if not conversation or conversation[0].content != SYSTEM_PROMPT:
# # # # # # # #         from langchain_core.messages import SystemMessage
# # # # # # # #         conversation = [SystemMessage(content=SYSTEM_PROMPT)] + conversation
    
# # # # # # # #     response = llm.invoke(conversation)
# # # # # # # #     response_text = response.content.strip()
    
# # # # # # # #     # Try to parse as JSON
# # # # # # # #     try:
# # # # # # # #         tool_call = json.loads(response_text)
# # # # # # # #         if "tool" in tool_call and "args" in tool_call:
# # # # # # # #             tool_name = tool_call["tool"]
# # # # # # # #             if tool_name == "get_weather":
# # # # # # # #                 return {
# # # # # # # #                     "messages": conversation + [response],
# # # # # # # #                     "tool_calls": [tool_call],
# # # # # # # #                     "next_action": "call_tool"
# # # # # # # #                 }
# # # # # # # #             else:
# # # # # # # #                 # Unknown tool – treat as error and answer naturally
# # # # # # # #                 error_msg = f"I don't have a tool named '{tool_name}'. Let me answer directly."
# # # # # # # #                 from langchain_core.messages import AIMessage
# # # # # # # #                 return {
# # # # # # # #                     "messages": conversation + [AIMessage(content=error_msg)],
# # # # # # # #                     "tool_calls": [],
# # # # # # # #                     "next_action": "end"
# # # # # # # #                 }
# # # # # # # #     except json.JSONDecodeError:
# # # # # # # #         # Not JSON – natural language answer
# # # # # # # #         pass
    
# # # # # # # #     return {
# # # # # # # #         "messages": conversation + [response],
# # # # # # # #         "tool_calls": [],
# # # # # # # #         "next_action": "end"
# # # # # # # #     }

# # # # # # # from langchain_ollama import ChatOllama
# # # # # # # from state import State
# # # # # # # import json

# # # # # # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # # # # def llm_node(state: State) -> dict:
# # # # # # #     conversation = state["messages"]
# # # # # # #     user_query = conversation[-1].content.lower()
    
# # # # # # #     # Rule-based decision: if "weather" in query, call tool; else answer naturally
# # # # # # #     if "weather" in user_query:
# # # # # # #         # Extract city (simplistic – assume last word)
# # # # # # #         words = user_query.split()
# # # # # # #         city = words[-1] if words else "unknown"
# # # # # # #         tool_call = {"tool": "get_weather", "args": {"city": city}}
# # # # # # #         # Create a mock AI message indicating tool call (optional)
# # # # # # #         from langchain_core.messages import AIMessage
# # # # # # #         mock_response = AIMessage(content=f"Calling weather tool for {city}")
# # # # # # #         return {
# # # # # # #             "messages": conversation + [mock_response],
# # # # # # #             "tool_calls": [tool_call],
# # # # # # #             "next_action": "call_tool"
# # # # # # #         }
# # # # # # #     else:
# # # # # # #         # Normal LLM response
# # # # # # #         response = llm.invoke(conversation)
# # # # # # #         return {
# # # # # # #             "messages": conversation + [response],
# # # # # # #             "tool_calls": [],
# # # # # # #             "next_action": "end"
# # # # # # #         }

# # # # # # from langchain_ollama import ChatOllama
# # # # # # from state import State
# # # # # # import json

# # # # # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # # # def llm_node(state: State) -> dict:
# # # # # #     conversation = state["messages"]
# # # # # #     user_query = conversation[-1].content.lower()
    
    
# # # # # #     # Rule-based tool selection
# # # # # #     if "weather" in user_query:
# # # # # #         words = user_query.split()
# # # # # #         # Extract city: assume last word or after "in"
# # # # # #         if "in" in words:
# # # # # #             idx = words.index("in") + 1
# # # # # #             city = " ".join(words[idx:]) if idx < len(words) else "unknown"
# # # # # #         else:
# # # # # #             city = words[-1] if words else "unknown"
# # # # # #         tool_call = {"tool": "get_weather", "args": {"city": city}}
# # # # # #         from langchain_core.messages import AIMessage
# # # # # #         mock_response = AIMessage(content=f"Calling weather tool for {city}")
# # # # # #         return {
# # # # # #             "messages": conversation + [mock_response],
# # # # # #             "tool_calls": [tool_call],
# # # # # #             "next_action": "call_tool"
# # # # # #         }
# # # # # #     elif any(kw in user_query for kw in ["calculate", "math", "compute", "+", "-", "*", "/"]):
# # # # # #         # Extract expression (simplistic – take everything after the keyword)
# # # # # #         expression = user_query.replace("calculate", "").replace("math", "").strip()
# # # # # #         tool_call = {"tool": "calculate", "args": {"expression": expression}}
# # # # # #         from langchain_core.messages import AIMessage
# # # # # #         mock_response = AIMessage(content=f"Calling calculator for {expression}")
# # # # # #         return {
# # # # # #             "messages": conversation + [mock_response],
# # # # # #             "tool_calls": [tool_call],
# # # # # #             "next_action": "call_tool"
# # # # # #         }
# # # # # #     else:
# # # # # #         response = llm.invoke(conversation)
# # # # # #         return {
# # # # # #             "messages": conversation + [response],
# # # # # #             "tool_calls": [],
# # # # # #             "next_action": "end"
# # # # # #         }
    
# # # # # from langchain_ollama import ChatOllama
# # # # # from langchain_core.messages import AIMessage
# # # # # from state import State

# # # # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # # def llm_node(state: State) -> dict:
# # # # #     conversation = state["messages"]
# # # # #     user_query = conversation[-1].content.lower()
# # # # #     iterations = state.get("iterations", 0) + 1

# # # # #     # Prevent infinite loops
# # # # #     if iterations > 5:
# # # # #         return {
# # # # #             "messages": conversation + [AIMessage(content="I've reached my limit of tool calls. Please ask a simpler question.")],
# # # # #             "tool_calls": [],
# # # # #             "next_action": "end",
# # # # #             "iterations": iterations
# # # # #         }

# # # # #     # Rule-based tool selection
# # # # #     if "weather" in user_query:
# # # # #         # Extract city (simple logic)
# # # # #         words = user_query.split()
# # # # #         if "in" in words:
# # # # #             idx = words.index("in") + 1
# # # # #             city = " ".join(words[idx:]) if idx < len(words) else "unknown"
# # # # #         else:
# # # # #             city = words[-1] if words else "unknown"
# # # # #         tool_call = {"tool": "get_weather", "args": {"city": city}}
# # # # #         mock_response = AIMessage(content=f"Calling weather tool for {city}")
# # # # #         return {
# # # # #             "messages": conversation + [mock_response],
# # # # #             "tool_calls": [tool_call],
# # # # #             "next_action": "call_tool",
# # # # #             "iterations": iterations
# # # # #         }

# # # # #     elif any(kw in user_query for kw in ["calculate", "math", "compute", "+", "-", "*", "/"]):
# # # # #         # Extract expression (remove keywords)
# # # # #         expression = user_query
# # # # #         for kw in ["calculate", "math", "compute"]:
# # # # #             expression = expression.replace(kw, "")
# # # # #         expression = expression.strip()
# # # # #         tool_call = {"tool": "calculate", "args": {"expression": expression}}
# # # # #         mock_response = AIMessage(content=f"Calling calculator for {expression}")
# # # # #         return {
# # # # #             "messages": conversation + [mock_response],
# # # # #             "tool_calls": [tool_call],
# # # # #             "next_action": "call_tool",
# # # # #             "iterations": iterations
# # # # #         }

# # # # #     else:
# # # # #         # Normal LLM response (no tool)
# # # # #         response = llm.invoke(conversation)
# # # # #         return {
# # # # #             "messages": conversation + [response],
# # # # #             "tool_calls": [],
# # # # #             "next_action": "end",
# # # # #             "iterations": iterations
# # # # #         } 

# # # # from state import State
# # # # from tools import get_weather, calculate
# # # # from langchain_core.messages import AIMessage

# # # # TOOLS = {
# # # #     "get_weather": get_weather,
# # # #     "calculate": calculate
# # # # }

# # # # def tool_node(state: State) -> dict:
# # # #     tool_calls = state.get("tool_calls", [])
# # # #     if not tool_calls:
# # # #         return {"next_action": "end", "tool_calls": []}
    
# # # #     results = []
# # # #     updated_messages = list(state["messages"])
# # # #     for call in tool_calls:
# # # #         tool_name = call.get("tool")
# # # #         args = call.get("args", {})
# # # #         if tool_name in TOOLS:
# # # #             try:
# # # #                 result = TOOLS[tool_name](**args)
# # # #                 results.append(result)
# # # #                 updated_messages.append(AIMessage(content=f"Tool result: {result}"))
# # # #             except Exception as e:
# # # #                 error_msg = f"Error: {str(e)}"
# # # #                 results.append(error_msg)
# # # #                 updated_messages.append(AIMessage(content=error_msg))
# # # #         else:
# # # #             error_msg = f"Error: unknown tool '{tool_name}'"
# # # #             results.append(error_msg)
# # # #             updated_messages.append(AIMessage(content=error_msg))
    
# # # #     return {
# # # #         "messages": updated_messages,
# # # #         "tool_results": results,
# # # #         "next_action": "end",     # After tool, we go to END? Actually we want to go back to LLM
# # # #         "tool_calls": []          # Clear tool calls
# # # #     }
# # # from langchain_ollama import ChatOllama
# # # from langchain_core.messages import AIMessage, SystemMessage
# # # from state import State

# # # # Initialize LLM
# # # llm = ChatOllama(model="llama3.1", temperature=0)

# # # # System prompt (optional, but helpful)
# # # SYSTEM_PROMPT = """You are a helpful assistant. You can use tools for weather and math.
# # # When you see a tool result, use it to answer naturally.
# # # Do not call a tool again if you already have the result.
# # # """

# # # def llm_node(state: State) -> dict:
# # #     # Get current conversation and iteration count
# # #     messages = state["messages"]
# # #     iterations = state.get("iterations", 0) + 1

# # #     # Prevent infinite loops
# # #     if iterations > 5:
# # #         fallback_msg = AIMessage(content="I've reached my limit of tool calls. Please ask a simpler question or try again.")
# # #         return {
# # #             "messages": messages + [fallback_msg],
# # #             "tool_calls": [],
# # #             "next_action": "end",
# # #             "iterations": iterations
# # #         }

# # #     # Add system prompt if not present
# # #     if not messages or not isinstance(messages[0], SystemMessage):
# # #         messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages

# # #     # Get the last user message
# # #     last_user_msg = None
# # #     for m in reversed(messages):
# # #         if hasattr(m, 'type') and m.type == 'human':
# # #             last_user_msg = m.content.lower()
# # #             break
# # #     if not last_user_msg:
# # #         last_user_msg = ""

# # #     # Check if the last message is already a tool result
# # #     # If the last message is from the tool node (contains "Tool result:"), then produce final answer
# # #     if len(messages) > 1 and "Tool result:" in messages[-1].content:
# # #         # Generate final answer using the conversation (includes tool result)
# # #         response = llm.invoke(messages)
# # #         return {
# # #             "messages": messages + [response],
# # #             "tool_calls": [],
# # #             "next_action": "end",
# # #             "iterations": iterations
# # #         }

# # #     # Otherwise, decide whether to call a tool based on user query
# # #     tool_call = None
# # #     if "weather" in last_user_msg:
# # #         # Extract city (simple)
# # #         words = last_user_msg.split()
# # #         if "in" in words:
# # #             idx = words.index("in") + 1
# # #             city = " ".join(words[idx:]) if idx < len(words) else "unknown"
# # #         else:
# # #             city = words[-1] if words else "unknown"
# # #         tool_call = {"tool": "get_weather", "args": {"city": city}}
# # #     elif any(kw in last_user_msg for kw in ["calculate", "math", "compute", "+", "-", "*", "/"]):
# # #         expr = last_user_msg
# # #         for kw in ["calculate", "math", "compute"]:
# # #             expr = expr.replace(kw, "")
# # #         expr = expr.strip()
# # #         tool_call = {"tool": "calculate", "args": {"expression": expr}}

# # #     if tool_call:
# # #         # We are requesting a tool call – add a placeholder AI message
# # #         placeholder = AIMessage(content=f"Calling tool: {tool_call['tool']}")
# # #         return {
# # #             "messages": messages + [placeholder],
# # #             "tool_calls": [tool_call],
# # #             "next_action": "call_tool",
# # #             "iterations": iterations
# # #         }
# # #     else:
# # #         # No tool needed – answer directly
# # #         response = llm.invoke(messages)
# # #         return {
# # #             "messages": messages + [response],
# # #             "tool_calls": [],
# # #             "next_action": "end",
# # #             "iterations": iterations
# # #         }

# # from langchain_ollama import ChatOllama
# # from langchain_core.messages import AIMessage, SystemMessage
# # from state import State

# # llm = ChatOllama(model="llama3.1", temperature=0)

# # def llm_node(state: State) -> dict:
# #     messages = state["messages"]
# #     iterations = state.get("iterations", 0) + 1

# #     # Limit iterations
# #     if iterations > 5:
# #         return {
# #             "messages": messages + [AIMessage(content="I've reached my limit. Please ask a simpler question.")],
# #             "tool_calls": [],
# #             "next_action": "end",
# #             "iterations": iterations
# #         }

# #     # Inject system prompt if missing
# #     if not messages or not isinstance(messages[0], SystemMessage):
# #         system = SystemMessage(content="You are a helpful assistant. Use tools when appropriate.")
# #         messages = [system] + messages

# #     # Detect if we already have a tool result in the conversation
# #     # If the last message is from the tool (contains "Tool result:"), generate final answer
# #     if len(messages) > 1 and "Tool result:" in messages[-1].content:
# #         response = llm.invoke(messages)
# #         return {
# #             "messages": messages + [response],
# #             "tool_calls": [],
# #             "next_action": "end",
# #             "iterations": iterations
# #         }

# #     # Get the last user message
# #     last_user = ""
# #     for m in reversed(messages):
# #         if hasattr(m, 'type') and m.type == 'human':
# #             last_user = m.content.lower()
# #             break

# #     # Decide tool or direct answer
# #     tool_call = None
# #     if "weather" in last_user:
# #         # simple city extraction
# #         words = last_user.split()
# #         if "in" in words:
# #             idx = words.index("in") + 1
# #             city = " ".join(words[idx:]) if idx < len(words) else "unknown"
# #         else:
# #             city = words[-1] if words else "unknown"
# #         tool_call = {"tool": "get_weather", "args": {"city": city}}
# #     elif any(kw in last_user for kw in ["calculate", "math", "compute", "+", "-", "*", "/"]):
# #         expr = last_user
# #         for kw in ["calculate", "math", "compute"]:
# #             expr = expr.replace(kw, "")
# #         expr = expr.strip()
# #         tool_call = {"tool": "calculate", "args": {"expression": expr}}

# #     if tool_call:
# #         # Create a placeholder AI message indicating tool call
# #         placeholder = AIMessage(content=f"[Calling tool: {tool_call['tool']}]")
# #         return {
# #             "messages": messages + [placeholder],
# #             "tool_calls": [tool_call],
# #             "next_action": "call_tool",
# #             "iterations": iterations
# #         }
# #     else:
# #         # No tool needed
# #         response = llm.invoke(messages)
# #         return {
# #             "messages": messages + [response],
# #             "tool_calls": [],
# #             "next_action": "end",
# #             "iterations": iterations
# #         }

# """Replace the final answer generation branch (where tool result is detected) with this:"""

# from langchain_ollama import ChatOllama
# from langchain_core.messages import AIMessage, SystemMessage
# from langchain_core.output_parsers import PydanticOutputParser
# from state import State
# from schemas import FinalAnswer

# llm = ChatOllama(model="llama3.1", temperature=0)
# parser = PydanticOutputParser(pydantic_object=FinalAnswer)
# format_instructions = parser.get_format_instructions()

# def llm_node(state: State) -> dict:
#     messages = state["messages"]
#     iterations = state.get("iterations", 0) + 1

#     # Limit iterations
#     if iterations > 5:
#         return {
#             "messages": messages + [AIMessage(content="I've reached my limit. Please ask a simpler question.")],
#             "tool_calls": [],
#             "next_action": "end",
#             "iterations": iterations
#         }

#     # Inject system prompt if missing
#     if not messages or not isinstance(messages[0], SystemMessage):
#         system = SystemMessage(content="You are a helpful assistant. Use tools when appropriate.")
#         messages = [system] + messages

#     # Detect if we already have a tool result in the conversation
#     if len(messages) > 1 and "Tool result:" in messages[-1].content:
#         # Ask LLM to produce structured output
#         structured_prompt = f"""Based on the conversation, provide a final answer in JSON format.
# {format_instructions}
# Do not include any extra text outside the JSON.

# Conversation so far:
# {messages[-2].content}
# Tool result: {messages[-1].content}
# """
#         response = llm.invoke([SystemMessage(content=structured_prompt)])
#         try:
#             parsed = parser.parse(response.content)
#             final_msg = AIMessage(content=f"Answer: {parsed.answer}\nConfidence: {parsed.confidence}")
#         except Exception as e:
#             # Fallback to plain text if parsing fails
#             final_msg = AIMessage(content=f"Answer: {response.content}")
#         return {
#             "messages": messages + [final_msg],
#             "tool_calls": [],
#             "next_action": "end",
#             "iterations": iterations
#         }

#     # Get the last user message
#     last_user = ""
#     for m in reversed(messages):
#         if hasattr(m, 'type') and m.type == 'human':
#             last_user = m.content.lower()
#             break

#     # Decide tool or direct answer
#     tool_call = None
#     if "weather" in last_user:
#         words = last_user.split()
#         if "in" in words:
#             idx = words.index("in") + 1
#             city = " ".join(words[idx:]) if idx < len(words) else "unknown"
#         else:
#             city = words[-1] if words else "unknown"
#         tool_call = {"tool": "get_weather", "args": {"city": city}}
#     elif any(kw in last_user for kw in ["calculate", "math", "compute", "+", "-", "*", "/"]):
#         expr = last_user
#         for kw in ["calculate", "math", "compute"]:
#             expr = expr.replace(kw, "")
#         expr = expr.strip()
#         tool_call = {"tool": "calculate", "args": {"expression": expr}}

#     if tool_call:
#         placeholder = AIMessage(content=f"[Calling tool: {tool_call['tool']}]")
#         return {
#             "messages": messages + [placeholder],
#             "tool_calls": [tool_call],
#             "next_action": "call_tool",
#             "iterations": iterations
#         }
#     else:
#         response = llm.invoke(messages)
#         return {
#             "messages": messages + [response],
#             "tool_calls": [],
#             "next_action": "end",
#             "iterations": iterations
#         }
from langchain_ollama import ChatOllama
from langchain_core.messages import AIMessage, SystemMessage
from langchain_core.output_parsers import PydanticOutputParser
from state import State
from schemas import FinalAnswer
from utils.logger import setup_logger

# Initialize logger
logger = setup_logger()

# Initialize LLM and output parser
llm = ChatOllama(model="llama3.1", temperature=0)
parser = PydanticOutputParser(pydantic_object=FinalAnswer)
format_instructions = parser.get_format_instructions()

def llm_node(state: State) -> dict:
    messages = state["messages"]
    iterations = state.get("iterations", 0) + 1

    logger.info(f"--- LLM Node (iteration {iterations}) ---")
    logger.debug(f"Number of messages: {len(messages)}")
    if messages:
        last_msg = messages[-1].content if hasattr(messages[-1], 'content') else str(messages[-1])
        logger.debug(f"Last message preview: {last_msg[:100]}...")

    # Limit iterations (safety)
    if iterations > 5:
        logger.warning("Iteration limit reached. Forcing end.")
        return {
            "messages": messages + [AIMessage(content="I've reached my limit. Please ask a simpler question.")],
            "tool_calls": [],
            "next_action": "end",
            "iterations": iterations
        }

    # Inject system prompt if missing
    if not messages or not isinstance(messages[0], SystemMessage):
        system = SystemMessage(content="You are a helpful assistant. Use tools when appropriate.")
        messages = [system] + messages

    # Check if the last message is a tool result
    if len(messages) > 1 and "Tool result:" in messages[-1].content:
        logger.info("Tool result detected. Generating structured final answer.")
        structured_prompt = f"""Based on the conversation, provide a final answer in JSON format.
{format_instructions}
Do not include any extra text outside the JSON.

Conversation so far:
{messages[-2].content}
Tool result: {messages[-1].content}
"""
        response = llm.invoke([SystemMessage(content=structured_prompt)])
        try:
            parsed = parser.parse(response.content)
            final_msg = AIMessage(content=f"Answer: {parsed.answer}\nConfidence: {parsed.confidence}")
            logger.info(f"Structured answer generated. Confidence: {parsed.confidence}")
        except Exception as e:
            logger.error(f"Failed to parse structured output: {e}")
            final_msg = AIMessage(content=f"Answer: {response.content}")
        
        return {
            "messages": messages + [final_msg],
            "tool_calls": [],
            "next_action": "end",
            "iterations": iterations
        }

    # Get the last user message
    last_user = ""
    for m in reversed(messages):
        if hasattr(m, 'type') and m.type == 'human':
            last_user = m.content.lower()
            break

    logger.info(f"User query: {last_user}")

    # Decide tool or direct answer
    tool_call = None
    if "weather" in last_user:
        words = last_user.split()
        if "in" in words:
            idx = words.index("in") + 1
            city = " ".join(words[idx:]) if idx < len(words) else "unknown"
        else:
            city = words[-1] if words else "unknown"
        tool_call = {"tool": "get_weather", "args": {"city": city}}
        logger.info(f"Decided to call weather tool for city: {city}")
    elif any(kw in last_user for kw in ["calculate", "math", "compute", "+", "-", "*", "/"]):
        expr = last_user
        for kw in ["calculate", "math", "compute"]:
            expr = expr.replace(kw, "")
        expr = expr.strip()
        tool_call = {"tool": "calculate", "args": {"expression": expr}}
        logger.info(f"Decided to call calculator tool with expression: {expr}")

    if tool_call:
        placeholder = AIMessage(content=f"[Calling tool: {tool_call['tool']}]")
        return {
            "messages": messages + [placeholder],
            "tool_calls": [tool_call],
            "next_action": "call_tool",
            "iterations": iterations
        }
    else:
        logger.info("No tool needed – generating direct answer.")
        response = llm.invoke(messages)
        return {
            "messages": messages + [response],
            "tool_calls": [],
            "next_action": "end",
            "iterations": iterations
        }
