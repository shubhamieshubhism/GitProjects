import gradio as gr
from .chain import build_rag_chain_with_memory

# Build the chain once
chain = build_rag_chain_with_memory()

def chat(message, history):
    response = chain({"question": message})
    return response

demo = gr.ChatInterface(
    fn=chat,
    title="Local RAG Chatbot",
    description="Ask questions about your documents. Powered by Ollama and LangChain.",
)

if __name__ == "__main__":
    #demo.launch(inbrowser=True, server_name="0.0.0.0", server_port=7860)
    demo.launch(inbrowser=True)