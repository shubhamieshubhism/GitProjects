# # from typing import TypedDict, List, Union
# # from langchain_core.messages import HumanMessage, AIMessage

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]

# from typing import TypedDict, List, Union, Optional
# from langchain_core.messages import HumanMessage, AIMessage
# from langchain_core.documents import Document

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]
#     context: Optional[str]           # formatted context string for LLM
#     retrieved_docs: List[Document]   # raw retrieved documents
#     compressed_context: Optional[str]   # NEW

from typing import TypedDict, List, Union, Optional
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.documents import Document

class State(TypedDict):
    # Core conversation
    messages: List[Union[HumanMessage, AIMessage]]

    # Retrieval & reranking
    retrieved_docs: List[Document]          # raw documents from retriever
    context: Optional[str]                  # formatted context before compression

    # Compression
    compressed_context: Optional[str]       # after LLM extraction

    # Scoring & metadata
    # (no separate field needed; handled inside reranker)

    # Hallucination detection
    hallucination_detected: bool

    # (Optional fields for future extensions)
    # need_retrieval: bool
    # error_count: int
    # next_node: str