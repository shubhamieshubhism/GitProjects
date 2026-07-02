"""Quick evaluation of retrieval quality."""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.rag_pipeline import PurePythonRAG
from src.evaluator import RAGEvaluator

def main():
    # Same documents as in main.py
    docs = [
        "Late payment incurs a 5% monthly fee on outstanding balance.",
        "Payments received after the 15th are considered late.",
        "Early payment before the 1st receives a 2% discount.",
        "All payments must be made in USD currency.",
        "Contact support@company.com for payment disputes."
    ]
    metadatas = [{"source": "policy.pdf"} for _ in docs]

    rag = PurePythonRAG()
    rag.add_documents(docs, metadatas)

    # Build test set (query, expected_chunk_index)
    test_cases = [
        ("late payment fee", 0),
        ("payment due date", 1),
        ("early discount", 2),
        ("currency for payment", 3),
        ("support email", 4),
        ("what is the penalty?", 0),
        ("when are payments due?", 1)
    ]

    evaluator = RAGEvaluator(rag)  # rag must have .search() method
    for q, idx in test_cases:
        evaluator.add_test_case(q, idx)

    # Run evaluation
    results = evaluator.full_evaluation(k_values=[1,3,5])

if __name__ == "__main__":
    main()