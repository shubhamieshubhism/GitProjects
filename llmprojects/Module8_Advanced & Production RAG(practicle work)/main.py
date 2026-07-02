# from langchain_core.messages import HumanMessage
# from graph import app

# def main():
#     print("Enterprise RAG (Step 1) - type 'quit' to exit")
#     state = {"messages": []}
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         state["messages"].append(HumanMessage(content=user_input))
#         final_state = app.invoke(state)
#         state = final_state
#         print(f"\nAssistant: {state['messages'][-1].content}")

# if __name__ == "__main__":
#     main()

import traceback
from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache  # or SQLiteCache
from langchain_community.cache import InMemoryCache

# Enable LLM caching
set_llm_cache(InMemoryCache())
# For persistent cache: set_llm_cache(SQLiteCache(database_path=".langchain.db"))

try:
    from langchain_core.messages import HumanMessage
    from graph import app
    print("Imports successful")
except Exception as e:
    print("Import error:")
    traceback.print_exc()
    exit(1)

def main():
    print("Enterprise RAG (Step 2) - Hybrid Retriever Active")
    print("Loading models and vector store (first query may be slow)...")
    #state = {"messages": []}
    #state = {"messages": [], "context": None, "retrieved_docs": []}
    state = {
        "messages": [],
        "context": None,
        "retrieved_docs": [],
        "compressed_context": None
    }
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        state["messages"].append(HumanMessage(content=user_input))
        final_state = app.invoke(state)
        state = final_state
        print(f"\nAssistant: {state['messages'][-1].content}")

if __name__ == "__main__":
    print("Starting main()")
    main()