# test_retriever.py
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.embeddings import OllamaEmbeddings

# Load and split
loader = TextLoader("data/handbook.txt")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
chunks = splitter.split_documents(docs)

# Create vectorstore
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma.from_documents(chunks, embeddings)

# Test query
query = "vacation policy"
results = vectorstore.similarity_search(query, k=2)

print(f"Query: {query}")
print(f"Number of results: {len(results)}")
for i, doc in enumerate(results):
    print(f"Result {i+1}: {doc.page_content}")