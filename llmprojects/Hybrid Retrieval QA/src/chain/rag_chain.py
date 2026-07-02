from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from src.retrieval.hybrid_retriever import build_hybrid_retriever
from src.llm.fallback_handler import llm_runnable

def format_docs(docs):
    return "\n\n".join([d.page_content for d in docs])

def build_rag_chain(docs_path: str):
    retriever = build_hybrid_retriever(docs_path)

    prompt = ChatPromptTemplate.from_template("""
    Answer the question based on the context below.
    Context: {context}
    Question: {question}
    Answer:""")

    rag_chain = (
        RunnableParallel(
            context=retriever | format_docs,
            question=RunnablePassthrough()
        )
        | prompt
        | llm_runnable
        | StrOutputParser()
    )
    return rag_chain