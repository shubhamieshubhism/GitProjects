# Pre‑compute and persist FAISS index for faster startup
from src.retrieval.hybrid_retriever import build_hybrid_retriever
import pickle
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--docs", required=True, help="Path to .txt or .pdf document")
    parser.add_argument("--output", default="faiss_index.pkl")
    args = parser.parse_args()

    retriever = build_hybrid_retriever(args.docs)
    # The retriever internally holds FAISS; we save it
    with open(args.output, "wb") as f:
        pickle.dump(retriever, f)
    print(f"Index saved to {args.output}")

if __name__ == "__main__":
    main()