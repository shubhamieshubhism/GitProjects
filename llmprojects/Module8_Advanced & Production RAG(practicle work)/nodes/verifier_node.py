from langchain_ollama import ChatOllama
from langchain_core.messages import AIMessage
from langchain_core.prompts import PromptTemplate
from state import State

llm = ChatOllama(model="llama3.1", temperature=0)

VERIFY_PROMPT = PromptTemplate.from_template("""
You are a fact-checker. Given the user's question, the retrieved context, and the assistant's answer, determine if the answer is fully supported by the context.

Context: {context}
Question: {question}
Answer: {answer}

Answer only "GROUNDED" if every statement in the answer can be found or directly inferred from the context. If any statement is not supported, answer "HALLUCINATED".

Verdict:
""")

def verifier_node(state: State) -> dict:
    question = state["messages"][-1].content
    context = state.get("compressed_context") or state.get("context", "")
    answer = state["messages"][-1].content
    
    prompt = VERIFY_PROMPT.format(context=context, question=question, answer=answer)
    verdict = llm.invoke(prompt).content.strip().upper()
    
    print(f"[VERIFIER] Verdict: {verdict}")
    
    if verdict == "HALLUCINATED":
        safe_answer = "I cannot provide a fully accurate answer based on the given information. Please check your sources."
        from langchain_core.messages import AIMessage
        new_messages = state["messages"][:-1] + [AIMessage(content=safe_answer)]
        return {"messages": new_messages, "hallucination_detected": True}
    else:
        return {"hallucination_detected": False}