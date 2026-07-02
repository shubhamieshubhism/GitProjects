from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from state import State

llm = ChatOllama(model="llama3.1", temperature=0)

# Prompt for extraction
EXTRACT_PROMPT = PromptTemplate.from_template("""
You are an expert at extracting relevant information. 
Given the user's question and a document, extract only the sentences that directly help answer the question.
If no sentence is relevant, output "NO_RELEVANT_INFO".

Question: {question}
Document: {document}

Relevant sentences:
""")

def compressor_node(state: State) -> dict:
    """Compress retrieved documents by extracting query-relevant sentences."""
    docs = state.get("retrieved_docs", [])
    if not docs:
        return {"compressed_context": "No documents retrieved."}
    
    question = state["messages"][-1].content
    compressed_parts = []
    
    print(f"\n[COMPRESSOR] Compressing {len(docs)} documents...")
    
    for i, doc in enumerate(docs):
        # Ask LLM to extract relevant sentences
        prompt = EXTRACT_PROMPT.format(question=question, document=doc.page_content)
        extracted = llm.invoke(prompt).content.strip()
        if extracted != "NO_RELEVANT_INFO":
            compressed_parts.append(extracted)
            print(f"  Document {i+1}: extracted {len(extracted)} chars")
        else:
            print(f"  Document {i+1}: no relevant info")
    
    compressed_context = "\n\n".join(compressed_parts) if compressed_parts else "No relevant information found."
    print(f"[COMPRESSOR] Compressed context length: {len(compressed_context)} characters\n")
    
    return {"compressed_context": compressed_context}