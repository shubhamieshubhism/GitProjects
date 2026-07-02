import streamlit as st
import os
import tempfile
from langchain_core.messages import HumanMessage
from graph import app

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

# Helper to save uploaded file temporarily
def save_uploaded_file(uploaded_file):
    if uploaded_file is not None:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(uploaded_file.name)[1]) as tmp:
            tmp.write(uploaded_file.getvalue())
            return tmp.name
    return None

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []
if "state" not in st.session_state:
    st.session_state.state = {
        "messages": [],
        "retrieved_docs": None,
        "image_path": None,
        "image_caption": None,
        "audio_path": None,
        "audio_transcript": None
    }

st.set_page_config(page_title="Multi‑modal RAG", page_icon="🧠")
st.title("🧠 Multi‑modal RAG: Text + Image + Audio")
st.markdown("Ask questions, upload an image or audio file, and get answers grounded in your knowledge base.")

# Sidebar for file uploads
with st.sidebar:
    st.header("Media Uploads")
    uploaded_image = st.file_uploader("Upload Image", type=["jpg", "jpeg", "png"])
    uploaded_audio = st.file_uploader("Upload Audio", type=["wav", "mp3", "m4a"])

    if uploaded_image:
        img_path = save_uploaded_file(uploaded_image)
        st.session_state.state["image_path"] = img_path
        st.success(f"Image loaded: {uploaded_image.name}")
        # Display thumbnail
        st.image(uploaded_image, width=150)

    if uploaded_audio:
        audio_path = save_uploaded_file(uploaded_audio)
        st.session_state.state["audio_path"] = audio_path
        st.success(f"Audio loaded: {uploaded_audio.name}")
        st.audio(uploaded_audio)

    if st.button("Clear Chat"):
        st.session_state.messages = []
        st.session_state.state = {
            "messages": [],
            "retrieved_docs": None,
            "image_path": None,
            "image_caption": None,
            "audio_path": None,
            "audio_transcript": None
        }
        st.rerun()

# Display chat history
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
        if "metadata" in msg and msg["metadata"].get("image_caption"):
            st.caption(f"🖼️ Caption: {msg['metadata']['image_caption']}")
        if "metadata" in msg and msg["metadata"].get("audio_transcript"):
            st.caption(f"🎤 Transcript: {msg['metadata']['audio_transcript']}")

# Chat input
user_input = st.chat_input("Ask something...")
if user_input:
    # Add user message to chat
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    # Update state with user question
    st.session_state.state["messages"].append(HumanMessage(content=user_input))

    # Run the graph
    final_state = app.invoke(st.session_state.state)
    st.session_state.state = final_state

    # Prepare assistant response
    assistant_msg = st.session_state.state["messages"][-1].content
    metadata = {}
    if st.session_state.state.get("image_caption"):
        metadata["image_caption"] = st.session_state.state["image_caption"]
    if st.session_state.state.get("audio_transcript"):
        metadata["audio_transcript"] = st.session_state.state["audio_transcript"]

    # Store assistant message with metadata
    st.session_state.messages.append({
        "role": "assistant",
        "content": assistant_msg,
        "metadata": metadata
    })

    # Display assistant response
    with st.chat_message("assistant"):
        st.markdown(assistant_msg)
        if metadata.get("image_caption"):
            st.caption(f"🖼️ Caption: {metadata['image_caption']}")
        if metadata.get("audio_transcript"):
            st.caption(f"🎤 Transcript: {metadata['audio_transcript']}")

    # Optionally show retrieved context in expander
    if st.session_state.state.get("retrieved_docs"):
        with st.expander("Retrieved Context"):
            for i, doc in enumerate(st.session_state.state["retrieved_docs"], 1):
                st.text(f"{i}. {doc[:300]}...")

    # Reset temporary media paths (they are no longer needed)
    if st.session_state.state.get("image_path"):
        try:
            os.unlink(st.session_state.state["image_path"])
        except:
            pass
        st.session_state.state["image_path"] = None
    if st.session_state.state.get("audio_path"):
        try:
            os.unlink(st.session_state.state["audio_path"])
        except:
            pass
        st.session_state.state["audio_path"] = None

    # Clear image_caption and audio_transcript after display (optional)
    st.session_state.state["image_caption"] = None
    st.session_state.state["audio_transcript"] = None
    st.rerun()