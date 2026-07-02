# # from langchain_community.document_loaders import TextLoader
# # from langchain_text_splitters import RecursiveCharacterTextSplitter
# # from langchain_chroma import Chroma
from langchain_community.retrievers import BM25Retriever
# # from langchain.retrievers import EnsembleRetriever
# # from state import State
# # from utils.embeddings import get_embeddings

# # # # Global variables for lazy loading (performance)
# # # _vectorstore = None
# # # _bm25_retriever = None
# # # _ensemble_retriever = None

# # # def load_documents():
# # #     loader = TextLoader("data/enterprise.txt")
# # #     docs = loader.load()
# # #     splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
# # #     return splitter.split_documents(docs)

# # # def get_ensemble_retriever():
# # #     global _ensemble_retriever, _vectorstore, _bm25_retriever
# # #     if _ensemble_retriever is None:
# # #         chunks = load_documents()
# # #         # Dense retriever (Chroma)
# # #         embeddings = get_embeddings()
# # #         _vectorstore = Chroma.from_documents(chunks, embeddings)
# # #         dense_retriever = _vectorstore.as_retriever(search_kwargs={"k": 5})
# # #         # Sparse retriever (BM25)
# # #         _bm25_retriever = BM25Retriever.from_documents(chunks, k=5)
# # #         # Ensemble (RRF)
# # #         _ensemble_retriever = EnsembleRetriever(
# # #             retrievers=[dense_retriever, _bm25_retriever],
# # #             weights=[0.5, 0.5]
# # #         )
# # #     return _ensemble_retriever

# # # def retriever_node(state: State) -> dict:
# # #     """Retrieve relevant documents using hybrid search."""
# # #     last_message = state["messages"][-1]
# # #     query = last_message.content
# # #     ensemble = get_ensemble_retriever()
# # #     docs = ensemble.invoke(query)
# # #     # Format context for LLM
# # #     context = "\n\n".join([doc.page_content for doc in docs])
# # #     return {"context": context, "retrieved_docs": docs}


# # import numpy as np

# # _vectorstore = None
# # _bm25_retriever = None
# # _ensemble_retriever = None
# # _dense_retriever = None

# # def load_documents():
# #     print("[DEBUG] Loading enterprise.txt...")
# #     loader = TextLoader("data/enterprise.txt")
# #     docs = loader.load()
# #     print(f"[DEBUG] Loaded {len(docs)} documents")
# #     splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
# #     chunks = splitter.split_documents(docs)
# #     print(f"[DEBUG] Split into {len(chunks)} chunks")
# #     return chunks

# # def get_retrievers():
# #     global _dense_retriever, _bm25_retriever, _ensemble_retriever, _vectorstore
# #     if _ensemble_retriever is None:
# #         chunks = load_documents()
# #         # Dense retriever
# #         embeddings = get_embeddings()
# #         _vectorstore = Chroma.from_documents(chunks, embeddings)
# #         _dense_retriever = _vectorstore.as_retriever(search_kwargs={"k": 5})
# #         # Sparse retriever (BM25)
# #         _bm25_retriever = BM25Retriever.from_documents(chunks, k=5)
# #         # Ensemble (RRF)
# #         _ensemble_retriever = EnsembleRetriever(
# #             retrievers=[_dense_retriever, _bm25_retriever],
# #             weights=[0.5, 0.5]
# #         )
# #         print("[DEBUG] Retrievers created.")
# #     return _dense_retriever, _bm25_retriever, _ensemble_retriever

# # def retriever_node(state: State) -> dict:
# #     last_message = state["messages"][-1]
# #     query = last_message.content
# #     print(f"\n[RETRIEVER] Query: {query}")
    
# #     dense_ret, bm25_ret, ensemble_ret = get_retrievers()
    
# #     # Get results with scores from dense retriever (if Chroma returns scores)
# #     dense_docs_with_scores = _vectorstore.similarity_search_with_score(query, k=5)
# #     print("\n[RETRIEVER] Dense (embedding) results:")
# #     for i, (doc, score) in enumerate(dense_docs_with_scores):
# #         print(f"  Rank {i+1}: score = {score:.4f} | preview: {doc.page_content[:80]}...")
    
# #     # BM25 doesn't directly provide scores, but we can call with `invoke` and then
# #     # we would need to compute scores manually. For simplicity, we just show the docs.
# #     bm25_docs = bm25_ret.invoke(query)
# #     print("\n[RETRIEVER] Sparse (BM25) results:")
# #     for i, doc in enumerate(bm25_docs):
# #         print(f"  Rank {i+1}: preview: {doc.page_content[:80]}...")
    
# #     # Ensemble results
# #     ensemble_docs = ensemble_ret.invoke(query)
# #     print("\n[RETRIEVER] Ensemble (RRF fused) results:")
# #     for i, doc in enumerate(ensemble_docs):
# #         print(f"  Rank {i+1}: preview: {doc.page_content[:80]}...")
    
# #     # Format context from ensemble results
# #     context = "\n\n".join([doc.page_content for doc in ensemble_docs])
# #     print(f"[RETRIEVER] Final context length: {len(context)} characters\n")
    
# #     return {"context": context, "retrieved_docs": ensemble_docs}

# from langchain_community.document_loaders import TextLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_chroma import Chroma
# from langchain_retrievers import BM25Retriever
# from langchain.retrievers import EnsembleRetriever, MultiQueryRetriever
# from langchain_ollama import ChatOllama
# from langchain_core.prompts import PromptTemplate
# from state import State
# from utils.embeddings import get_embeddings

# # Global variables for lazy loading
# _vectorstore = None
# _bm25_retriever = None
# _ensemble_retriever = None
# _multi_retriever = None

# def load_documents():
#     """Load and split the enterprise.txt file."""
#     print("[DEBUG] Loading enterprise.txt...")
#     loader = TextLoader("data/enterprise.txt")
#     docs = loader.load()
#     print(f"[DEBUG] Loaded {len(docs)} documents")
#     splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
#     chunks = splitter.split_documents(docs)
#     print(f"[DEBUG] Split into {len(chunks)} chunks")
#     return chunks

# def get_ensemble_retriever():
#     """Create or return a hybrid retriever (dense + sparse) using RRF."""
#     global _ensemble_retriever, _vectorstore, _bm25_retriever
#     if _ensemble_retriever is None:
#         chunks = load_documents()
#         # Dense retriever (Chroma + Ollama embeddings)
#         embeddings = get_embeddings()
#         _vectorstore = Chroma.from_documents(chunks, embeddings)
#         dense_retriever = _vectorstore.as_retriever(search_kwargs={"k": 5})
#         # Sparse retriever (BM25)
#         _bm25_retriever = BM25Retriever.from_documents(chunks, k=5)
#         # Ensemble using Reciprocal Rank Fusion
#         _ensemble_retriever = EnsembleRetriever(
#             retrievers=[dense_retriever, _bm25_retriever],
#             weights=[0.5, 0.5]
#         )
#         print("[DEBUG] Hybrid ensemble retriever created.")
#     return _ensemble_retriever

# def get_multi_query_retriever():
#     """Create or return a MultiQueryRetriever that wraps the hybrid retriever."""
#     global _multi_retriever
#     if _multi_retriever is None:
#         base_retriever = get_ensemble_retriever()
#         llm = ChatOllama(model="llama3.1", temperature=0)
#         _multi_retriever = MultiQueryRetriever.from_llm(
#             retriever=base_retriever,
#             llm=llm,
#             num_queries=3,           # generate 3 alternative queries
#             include_original=True    # include the original query
#         )
#         print("[DEBUG] MultiQueryRetriever created (generates 3 alternative queries).")
#     return _multi_retriever

# def retriever_node(state: State) -> dict:
#     """Retrieve documents using multi-query optimization."""
#     last_message = state["messages"][-1]
#     query = last_message.content
#     print(f"\n[RETRIEVER] Original query: {query}")

#     # Step 1: Show the alternative queries (manually generated for display)
#     # This does NOT affect retrieval; it's only for debugging.
#     prompt_template = PromptTemplate.from_template(
#         "You are a helpful assistant. Generate 3 different versions of the following user question, "
#         "each with different wording. Return only the queries, one per line.\n\n"
#         "Original question: {question}\n\nAlternatives:"
#     )
#     llm = ChatOllama(model="llama3.1", temperature=0)
#     alternative_queries = llm.invoke(prompt_template.format(question=query)).content.strip().split("\n")
#     print("[RETRIEVER] Generated alternative queries:")
#     for i, q in enumerate(alternative_queries, 1):
#         print(f"  {i}. {q}")

#     # Step 2: Perform multi‑query retrieval
#     multi_retriever = get_multi_query_retriever()
#     docs = multi_retriever.invoke(query)

#     print(f"[RETRIEVER] Retrieved {len(docs)} documents (after multi-query fusion).")
#     # Optional: show previews of retrieved docs
#     for i, doc in enumerate(docs[:3]):  # show first 3
#         print(f"  Doc {i+1}: {doc.page_content[:100]}...")

#     # Step 3: Format context for the LLM
#     context = "\n\n".join([doc.page_content for doc in docs])
#     print(f"[RETRIEVER] Final context length: {len(context)} characters\n")

#     return {"context": context, "retrieved_docs": docs}

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

from langchain.retrievers import EnsembleRetriever
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from state import State
from utils.embeddings import get_embeddings
import hashlib

_vectorstore = None
_bm25_retriever = None
_ensemble_retriever = None

def load_documents():
    print("[DEBUG] Loading enterprise.txt...")
    loader = TextLoader("data/enterprise.txt")
    docs = loader.load()
    print(f"[DEBUG] Loaded {len(docs)} documents")
    splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
    chunks = splitter.split_documents(docs)
    print(f"[DEBUG] Split into {len(chunks)} chunks")
    return chunks

def get_ensemble_retriever():
    global _ensemble_retriever, _vectorstore, _bm25_retriever
    if _ensemble_retriever is None:
        chunks = load_documents()
        embeddings = get_embeddings()
        _vectorstore = Chroma.from_documents(chunks, embeddings)
        dense_retriever = _vectorstore.as_retriever(search_kwargs={"k": 5})
        _bm25_retriever = BM25Retriever.from_documents(chunks, k=5)
        _ensemble_retriever = EnsembleRetriever(
            retrievers=[dense_retriever, _bm25_retriever],
            weights=[0.5, 0.5]
        )
        print("[DEBUG] Hybrid ensemble retriever created.")
    return _ensemble_retriever

def retriever_node(state: State) -> dict:
    last_message = state["messages"][-1]
    query = last_message.content
    print(f"\n[RETRIEVER] Original query: {query}")

    # Generate alternative queries using LLM
    prompt_template = PromptTemplate.from_template(
        "You are a helpful assistant. Generate 3 different versions of the following user question, "
        "each with different wording. Return only the queries, one per line.\n\n"
        "Original question: {question}\n\nAlternatives:"
    )
    llm = ChatOllama(model="llama3.1", temperature=0)
    alternative_queries_text = llm.invoke(prompt_template.format(question=query)).content.strip()
    alternative_queries = [q.strip() for q in alternative_queries_text.split("\n") if q.strip()]
    print("[RETRIEVER] Generated alternative queries:")
    for i, q in enumerate(alternative_queries, 1):
        print(f"  {i}. {q}")

    # Combine original + alternatives
    all_queries = [query] + alternative_queries
    base_retriever = get_ensemble_retriever()
    all_docs = []
    seen_hashes = set()

    for q in all_queries:
        docs = base_retriever.invoke(q)
        for doc in docs:
            # Use content hash for deduplication
            doc_hash = hashlib.md5(doc.page_content.encode()).hexdigest()
            if doc_hash not in seen_hashes:
                seen_hashes.add(doc_hash)
                all_docs.append(doc)

    print(f"[RETRIEVER] Retrieved {len(all_docs)} unique documents after multi-query fusion.")
    for i, doc in enumerate(all_docs[:3]):
        print(f"  Doc {i+1}: {doc.page_content[:100]}...")

    context = "\n\n".join([doc.page_content for doc in all_docs])
    print(f"[RETRIEVER] Final context length: {len(context)} characters\n")

    return {"context": context, "retrieved_docs": all_docs}