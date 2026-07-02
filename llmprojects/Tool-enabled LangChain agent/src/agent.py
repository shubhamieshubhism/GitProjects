# src/agent.py
from langchain.agents import create_react_agent, AgentExecutor
from src.model import get_llm
from src.tools import calculate, search_web
from src.prompt import get_agent_prompt

def build_agent():
    # 1. Get the LLM
    llm = get_llm()
    
    # 2. List of tools
    tools = [calculate, search_web]
    
    # 3. Get the prompt template
    prompt = get_agent_prompt()
    
    # 4. Create the agent (ReAct style)
    agent = create_react_agent(llm, tools, prompt)
    
    # 5. Create the executor (runs the agent loop)
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,           # prints thoughts and actions (useful for learning)
        max_iterations=5,       # stops after 5 loops to prevent infinite loops
        handle_parsing_errors=True  # if the LLM outputs gibberish, try to fix
    )
    
    return agent_executor