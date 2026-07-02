import argparse
import logging
from src.chain.rag_chain import build_rag_chain

logging.basicConfig(level=logging.INFO)

def main():
    parser = argparse.ArgumentParser(description="Hybrid QA System")
    parser.add_argument("--docs", required=True, help="Path to text document")
    parser.add_argument("--question", required=True, help="Question to answer")
    args = parser.parse_args()

    chain = build_rag_chain(args.docs)
    answer = chain.invoke(args.question)
    print(f"\nAnswer: {answer}")

if __name__ == "__main__":
    main()