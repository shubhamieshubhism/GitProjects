#!/usr/bin/env python3
"""Example usage of the RAG pipeline."""
from src.rag_pipeline import PurePythonRAG

def main():
    # Sample documents – in practice you would load from files
    documents = [
        "Late payment incurs a 5% monthly fee on outstanding balance.",
        "Payments received after the 15th are considered late.",
        "Early payment before the 1st receives a 2% discount.",
        "All payments must be made in USD currency.",
        "Contact support@company.com for payment disputes."
    ]
    metadatas = [{"source": "policy.pdf"} for _ in documents]

    # Initialize RAG
    rag = PurePythonRAG()
    rag.add_documents(documents, metadatas)

    # Ask questions
    questions = [
        "What happens if I pay late?",
        "Is there a discount for early payment?",
        "What currency should I use?"
    ]

    for q in questions:
        result = rag.query(q, verbose=True, use_openai=False)  # use Ollama
        print("\n" + "="*50)
        print(f"QUESTION: {result['question']}")
        print(f"ANSWER: {result['answer']}")
        print(f"SOURCES: {len(result['sources'])} chunks used")
        print("="*50 + "\n")

if __name__ == "__main__":
    main()