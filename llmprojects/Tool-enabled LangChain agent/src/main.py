# from src.model import get_llm

# llm = get_llm()
# response = llm.invoke("What is the capital of France?")
# print(response.content)

# # Add at the bottom of src/main.py (temporary test)
# from src.tools import calculate, search_web

# print(calculate.invoke({"expression": "25 * 4"}))   # Should print "100"
# print(search_web.invoke({"query": "capital of France"}))  # Should print something with "Paris"

# from src.prompt import get_agent_prompt
# prompt = get_agent_prompt()
# print(prompt.template)  # Should print the template string

# src/main.py
from src.agent import build_agent

def main():
    print("Building agent... (first run may take a moment)")
    agent = build_agent()
    print("Agent ready! Type your questions (or 'quit' to exit).\n")
    
    while True:
        question = input("You: ")
        if question.lower() in ["quit", "exit"]:
            break
        
        # Run the agent on the question
        result = agent.invoke({"input": question})
        print(f"\nBot: {result['output']}\n")

if __name__ == "__main__":
    main()