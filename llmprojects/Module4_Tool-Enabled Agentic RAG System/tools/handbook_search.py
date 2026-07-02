# from langchain_community.document_loaders import TextLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_chroma import Chroma
# from langchain_ollama import OllamaEmbeddings
# from langchain.tools.retriever import create_retriever_tool

# # Load and split handbook
# loader = TextLoader("data/handbook.txt")
# docs = loader.load()
# splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
# chunks = splitter.split_documents(docs)

# # Create vector store
# embeddings = OllamaEmbeddings(model="nomic-embed-text")
# vectorstore = Chroma.from_documents(chunks, embeddings)

# # Create retriever tool
# handbook_tool = create_retriever_tool(
#     retriever=vectorstore.as_retriever(search_kwargs={"k": 2}),
#     name="handbook_search",
#     description="Search the company handbook for policies on vacation, VPN, expenses."
# )

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain.tools.retriever import create_retriever_tool

loader = TextLoader("data/handbook.txt")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
chunks = splitter.split_documents(docs)

embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma.from_documents(chunks, embeddings)

handbook_tool = create_retriever_tool(
    retriever=vectorstore.as_retriever(search_kwargs={"k": 2}),
    name="handbook_search",
    description="Search the company handbook for policies on vacation, VPN, expenses."
)