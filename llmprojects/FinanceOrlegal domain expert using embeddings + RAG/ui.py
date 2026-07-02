# ui.py
import streamlit as st
from langchain_core.messages import HumanMessage
from graph import app
from state import State
from utils.eval import log_metric

# Initialize session state
if "state" not in st.session_state:
    st.session_state.state = {
        "messages": [],
        "tool_calls": [],
        "tool_results": [],
        "context": None,
        "next_action": "",
        "turn_id": 0
    }

st.set_page_config(page_title="Finance/Legal Expert", page_icon="⚖️")
st.title("⚖️ Finance & Legal Domain Expert")
st.markdown("Ask me about bonds, stocks, contracts, regulations, or general knowledge.")

# Display chat history
for msg in st.session_state.state["messages"]:
    if msg.type == "human":
        st.chat_message("user").write(msg.content)
    elif msg.type == "ai":
        st.chat_message("assistant").write(msg.content)
    elif "Tool result" in msg.content:
        with st.chat_message("tool"):
            st.markdown(f"**Tool result:** {msg.content}")

# Input box
user_input = st.chat_input("Your question...")
if user_input:
    # Update state
    st.session_state.state["turn_id"] += 1
    st.session_state.state["messages"].append(HumanMessage(content=user_input))
    st.session_state.state["next_action"] = ""

    # Run the graph
    final_state = app.invoke(st.session_state.state)
    # Merge the new messages into session state (the graph returns the full updated state)
    st.session_state.state = final_state

    # Log user rating (optional – you can add a rating widget later)
    # For now, we skip rating to keep UI simple

    # Rerun to refresh the UI
    st.rerun()