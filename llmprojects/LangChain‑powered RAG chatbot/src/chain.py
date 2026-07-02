# # src/chain.py
# from langchain_core.runnables import RunnableParallel, RunnablePassthrough
# from langchain_core.output_parsers import StrOutputParser
# from .vector_store import create_vector_store, load_and_split_documents
# from .prompt import get_prompt
# from .model import get_llm

# def format_docs(docs):
#     """Join retrieved documents into a single string."""
#     return "\n\n".join(doc.page_content for doc in docs)

# def build_rag_chain():
#     """Build the complete RAG chain."""
#     # 1. Load and split documents (or load existing vector store)
#     chunks = load_and_split_documents()
#     vectorstore = create_vector_store(chunks)
    
#     # 2. Create a retriever from the vector store
#     retriever = vectorstore.as_retriever(search_kwargs={"k": 3})  # return top 3 chunks
    
#     # 3. Get the prompt and the LLM
#     prompt = get_prompt()
#     llm = get_llm()
    
#     # 4. Build the LCEL chain
#     rag_chain = (
#         RunnableParallel(
#             context=retriever | format_docs,
#             question=RunnablePassthrough()
#         )
#         | prompt
#         | llm
#         | StrOutputParser()
#     )
    
#     return rag_chain

# We will create a new function build_rag_chain_with_memory().
# src/chain.py (updated)
# from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
# from langchain_core.output_parsers import StrOutputParser
# from .vector_store import create_vector_store, load_and_split_documents
# from .prompt import get_prompt
# from .model import get_llm
# from .memory import create_memory

# def format_docs(docs):
#     return "\n\n".join(doc.page_content for doc in docs)

# def condense_question(question: str, chat_history: list) -> str:
#     """Use the LLM to rephrase the question with chat history."""
#     if not chat_history:
#         return question
#     from .model import get_llm
#     from langchain_core.prompts import ChatPromptTemplate
#     condense_prompt = ChatPromptTemplate.from_messages([
#         ("system", "Given the following chat history and a follow-up question, rephrase the question to be standalone."),
#         ("placeholder", "{chat_history}"),
#         ("human", "{question}")
#     ])
#     llm = get_llm()
#     chain = condense_prompt | llm | StrOutputParser()
#     return chain.invoke({"chat_history": chat_history, "question": question})

# def build_rag_chain_with_memory():
#     """Build RAG chain with conversation memory."""
#     # Load and split documents, create vector store and retriever
#     chunks = load_and_split_documents()
#     vectorstore = create_vector_store(chunks)
#     retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
#     # Create memory
#     memory = create_memory(k=3)
    
#     # Get prompt and LLM
#     prompt = get_prompt()
#     llm = get_llm()
    
#     # Helper to load chat history from memory
#     def load_chat_history(_):
#         return memory.load_memory_variables({})["chat_history"]
    
#     # Helper to condense question using history
#     def condense(inputs):
#         return condense_question(inputs["question"], inputs["chat_history"])
    
#     # Main chain
#     rag_chain = (
#         RunnablePassthrough.assign(chat_history=load_chat_history)
#         | RunnablePassthrough.assign(condensed_question=condense)
#         | RunnableParallel(
#             context=RunnableLambda(lambda x: retriever.invoke(x["condensed_question"])) | RunnableLambda(format_docs),
#             question=RunnableLambda(lambda x: x["question"]),
#             chat_history=RunnableLambda(lambda x: x["chat_history"])
#         )
#         | prompt
#         | llm
#         | StrOutputParser()
#     )
    
#     # Wrap chain to also save context to memory after generation
#     def chain_with_memory(inputs):
#         # Generate answer
#         answer = rag_chain.invoke(inputs)
#         # Save to memory
#         memory.save_context({"input": inputs["question"]}, {"output": answer})
#         return answer
    
#     return chain_with_memory


"""load_chat_history – fetches the saved history.
condense – calls a helper function that uses the LLM to rewrite the question using history.
retriever.invoke(x["condensed_question"]) – uses the condensed question (better search).
chain_with_memory – saves the interaction after generation."""

# src/chain.py (updated)
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from .vector_store import get_or_create_vector_store
from .prompt import get_prompt
from .model import get_llm
from .memory import create_memory

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def condense_question(question: str, chat_history: list) -> str:
    """Use the LLM to rephrase the question with chat history."""
    if not chat_history:
        return question
    from .model import get_llm
    condense_prompt = ChatPromptTemplate.from_messages([
        ("system", "Given the following chat history and a follow-up question, rephrase the question to be standalone."),
        ("placeholder", "{chat_history}"),
        ("human", "{question}")
    ])
    llm = get_llm()
    chain = condense_prompt | llm | StrOutputParser()
    return chain.invoke({"chat_history": chat_history, "question": question})

def build_rag_chain_with_memory():
    """Build RAG chain with conversation memory and persistent vector store."""
    # Get or create vector store (loads from disk if exists)
    vectorstore = get_or_create_vector_store()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    memory = create_memory(k=3)
    prompt = get_prompt()
    llm = get_llm()
    
    def load_chat_history(_):
        return memory.load_memory_variables({})["chat_history"]
    
    def condense(inputs):
        return condense_question(inputs["question"], inputs["chat_history"])
    
    rag_chain = (
        RunnablePassthrough.assign(chat_history=load_chat_history)
        | RunnablePassthrough.assign(condensed_question=condense)
        | RunnableParallel(
            context=RunnableLambda(lambda x: retriever.invoke(x["condensed_question"])) | RunnableLambda(format_docs),
            question=RunnableLambda(lambda x: x["question"]),
            chat_history=RunnableLambda(lambda x: x["chat_history"])
        )
        | prompt
        | llm
        | StrOutputParser()
    )
    
    def chain_with_memory(inputs):
        answer = rag_chain.invoke(inputs)
        memory.save_context({"input": inputs["question"]}, {"output": answer})
        return answer
    
    return chain_with_memory