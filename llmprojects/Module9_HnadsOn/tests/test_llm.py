from langchain_ollama import ChatOllama

llm = ChatOllama(model="llama3.1", temperature=0)
response = llm.invoke("Say 'Hello, I am ready'")
print(response.content)