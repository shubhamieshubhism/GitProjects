# src/prompt.py
from langchain_core.prompts import PromptTemplate

def get_agent_prompt():
#     template = """Answer the following questions as best you can. You have access to the following tools:

# {tools}

# Use the following format:

# Question: the input question you must answer
# Thought: you should always think about what to do
# Action: the action to take, should be one of [{tool_names}]
# Action Input: the input to the action
# Observation: the result of the action
# ... (this Thought/Action/Action Input/Observation can repeat N times)
# Thought: I now know the final answer
# Final Answer: the final answer to the original input question

# Begin!

# Example 1:
# Question: What is the weather in Tokyo?
# Action: get_weather
# Action Input: Tokyo
# Observation: Weather in Tokyo: 22°C, wind speed 10 km/h
# Final Answer: The weather in Tokyo is 22°C with 10 km/h wind.

# Example 2:
# Question: What is 15 * 3?
# Action: calculate
# Action Input: 15 * 3
# Observation: 45
# Final Answer: 45

# Now answer the user's question.

# Question: {input}
# {agent_scratchpad}"""
    template = """You are an assistant. You MUST follow these rules:

Rule 1: If the user asks about weather, temperature, or climate, you MUST use the get_weather tool. NEVER use web search for weather.
Rule 2: If the user asks a math question, use the calculate tool.
Rule 3: For all other questions, use search_web.

Tools: {tools}
Tool Names: [{tool_names}]

Example:
Question: What is the weather in Paris?
Action: get_weather
Action Input: Paris
Observation: Weather in Paris: 18°C
Final Answer: The weather in Paris is 18°C.

Now answer:

Question: {input}
{agent_scratchpad}"""
    return PromptTemplate.from_template(template)