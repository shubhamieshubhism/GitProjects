# from sentence_transformers import CrossEncoder
# from state import State
# from datetime import datetime
# import re

# # Load the cross-encoder model once globally
# _model = None

# def get_cross_encoder():
#     global _model
#     if _model is None:
#         # Use a relatively fast, good quality model (about 400MB)
#         _model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
#         # Alternative: 'BAAI/bge-reranker-base' (larger, more accurate)
#         print("[RERANKER] Cross-encoder model loaded.")
#     return _model

# def reranker_node(state: State) -> dict:
#     """Re-rank retrieved documents using a cross-encoder."""
#     docs = state.get("retrieved_docs", [])
#     if not docs:
#         print("[RERANKER] No documents to rerank.")
#         return {"context": state.get("context", "")}

#     query = state["messages"][-1].content
#     model = get_cross_encoder()
    
#     # Prepare pairs (query, document text)
#     pairs = [(query, doc.page_content) for doc in docs]
#     scores = model.predict(pairs)  # returns list of scores (float)
    
#     # Combine documents with their scores, sort by score descending
#     scored_docs = list(zip(docs, scores))
#     scored_docs.sort(key=lambda x: x[1], reverse=True)
    
#     # Print debug info
#     print("\n[RERANKER] Cross-encoder scores:")
#     for doc, score in scored_docs[:3]:
#         print(f"  Score: {score:.4f} | preview: {doc.page_content[:80]}...")
    
#     # Keep top 3 documents after reranking
#     top_docs = [doc for doc, _ in scored_docs[:3]]
    
#     # Format context from top documents
#     context = "\n\n".join([doc.page_content for doc in top_docs])
#     print(f"[RERANKER] Final context length: {len(context)} characters\n")
    
#     return {"context": context, "retrieved_docs": top_docs}

from sentence_transformers import CrossEncoder
from state import State

# Global cross-encoder model
_model = None

def get_cross_encoder():
    global _model
    if _model is None:
        # Use a lightweight, fast model (adjust as needed)
        _model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
        print("[RERANKER] Cross-encoder model loaded.")
    return _model

def extract_metadata(doc):
    """
    Extract recency and authority scores from document content.
    This is a simple rule‑based example; in production you would use real metadata fields.
    """
    content = doc.page_content.lower()
    # Recency: keywords or dates
    if "recent" in content or "2023" in content or "2024" in content:
        recency = 0.9
    elif "1945" in content or "1918" in content or "world war" in content:
        recency = 0.2   # older historical content
    else:
        recency = 0.5
    
    # Authority: certain sources or keywords
    if "official" in content or "policy" in content or "confirmed" in content:
        authority = 0.8
    else:
        authority = 0.5
    return recency, authority

def compute_final_score(relevance_score, recency, authority):
    """
    Weighted combination: tune weights as needed.
    Relevance (cross‑encoder) is most important.
    """
    return 0.7 * relevance_score + 0.2 * recency + 0.1 * authority

def reranker_node(state: State) -> dict:
    """Re‑rank retrieved documents using cross‑encoder + metadata‑based scoring."""
    docs = state.get("retrieved_docs", [])
    if not docs:
        print("[RERANKER] No documents to rerank.")
        return {"context": state.get("context", ""), "retrieved_docs": []}

    query = state["messages"][-1].content
    model = get_cross_encoder()
    
    # Prepare pairs (query, document text) for cross‑encoder
    pairs = [(query, doc.page_content) for doc in docs]
    relevance_scores = model.predict(pairs)  # list of floats
    
    # Compute final scores with metadata
    scored_docs = []
    for doc, rel_score in zip(docs, relevance_scores):
        recency, authority = extract_metadata(doc)
        final_score = compute_final_score(rel_score, recency, authority)
        scored_docs.append((doc, final_score, rel_score, recency, authority))
    
    # Sort by final score (descending)
    scored_docs.sort(key=lambda x: x[1], reverse=True)
    
    # Debug output
    print("\n[RERANKER] Cross‑encoder + metadata results:")
    for doc, final, rel, rec, auth in scored_docs[:3]:
        print(f"  Weighted: {final:.3f} (rel={rel:.3f}, rec={rec:.2f}, auth={auth:.2f}) | {doc.page_content[:70]}...")
    
    # Keep top 3 documents after re‑ranking
    top_docs = [doc for doc, _, _, _, _ in scored_docs[:3]]
    
    # Format context
    context = "\n\n".join([doc.page_content for doc in top_docs])
    print(f"[RERANKER] Final context length: {len(context)} characters\n")
    
    return {"context": context, "retrieved_docs": top_docs}