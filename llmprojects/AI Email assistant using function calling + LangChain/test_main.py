from src.model import get_llm

llm = get_llm()
response = llm.invoke("What is the capital of France?")
print(response.content)