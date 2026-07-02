# src/main.py
"""from src.model import get_llm

def main():
    llm = get_llm()
    response = llm.invoke("What is the capital of France? and what is its population")
    print(response.content)

if __name__ == "__main__":
    main()"""
    
"""# src/main.py
from .chain import build_rag_chain

def main():
    print("Building RAG chain (this may take a moment)...")
    rag_chain = build_rag_chain()
    print("Ready! Ask me questions about your documents (type 'quit' to exit).\n")
    
    while True:
        question = input("You: ")
        if question.lower() in ["quit", "exit"]:
            break
        
        print("Bot: ", end="", flush=True)
        # Stream the answer word by word
        for chunk in rag_chain.stream(question):
            print(chunk, end="", flush=True)
        print("\n")

if __name__ == "__main__":
    main()"""
    
    # src/main.py (updated)
from .chain import build_rag_chain_with_memory

def main():
    print("Building RAG chain with memory (this may take a moment)...")
    rag_chain = build_rag_chain_with_memory()
    print("Ready! Ask me questions. I remember the last 3 exchanges.\n")
    
    while True:
        question = input("You: ")
        if question.lower() in ["quit", "exit"]:
            break
        
        print("Bot: ", end="", flush=True)
        answer = rag_chain({"question": question})
        print(answer)
        print()

if __name__ == "__main__":
    main()