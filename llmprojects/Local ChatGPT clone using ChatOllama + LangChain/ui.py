# # import streamlit as st
# # from langchain_core.messages import HumanMessage
# # from graph import app

# # # Initialize session state
# # if "state" not in st.session_state:
# #     st.session_state.state = {
# #         "messages": [],
# #         "tool_calls": [],
# #         "tool_results": [],
# #         "next_action": ""
# #     }

# # st.set_page_config(page_title="Local ChatGPT", page_icon="🤖")
# # st.title("🤖 Local ChatGPT (Ollama + LangGraph)")

# # # Display chat history
# # for msg in st.session_state.state["messages"]:
# #     if msg.type == "human":
# #         st.chat_message("user").write(msg.content)
# #     elif msg.type == "ai":
# #         st.chat_message("assistant").write(msg.content)
# #     elif "Tool result" in msg.content:
# #         with st.chat_message("tool"):
# #             st.markdown(f"**Tool result:** {msg.content}")

# # # Input box
# # user_input = st.chat_input("Ask something...")
# # if user_input:
# #     # Add user message to state
# #     st.session_state.state["messages"].append(HumanMessage(content=user_input))
# #     # Run the graph
# #     final_state = app.invoke(st.session_state.state)
# #     st.session_state.state = final_state
# #     # Clear tool results after showing them (optional)
# #     if st.session_state.state.get("tool_results"):
# #         st.session_state.state["tool_results"] = []
# #     st.session_state.state["next_action"] = ""
# #     # Rerun to refresh the UI
# #     st.rerun()

# # # Optional: Clear chat button
# # if st.sidebar.button("Clear Chat"):
# #     st.session_state.state = {
# #         "messages": [],
# #         "tool_calls": [],
# #         "tool_results": [],
# #         "next_action": ""
# #     }
# #     st.rerun()

# import streamlit as st
# from langchain_core.messages import HumanMessage
# from graph import app

# MAX_HISTORY = 6

# # Initialize session state
# if "state" not in st.session_state:
#     st.session_state.state = {
#         "messages": [],
#         "tool_calls": [],
#         "tool_results": [],
#         "next_action": ""
#     }

# st.set_page_config(page_title="Local ChatGPT", page_icon="🤖")
# st.title("🤖 Local ChatGPT (Ollama + LangGraph)")

# # Display chat history
# for msg in st.session_state.state["messages"]:
#     if msg.type == "human":
#         st.chat_message("user").write(msg.content)
#     elif msg.type == "ai":
#         st.chat_message("assistant").write(msg.content)
#     elif "Tool result" in msg.content:
#         with st.chat_message("tool"):
#             st.markdown(f"**Tool result:** {msg.content}")

# # Input box
# user_input = st.chat_input("Ask something...")
# if user_input:
#     # Add user message
#     st.session_state.state["messages"].append(HumanMessage(content=user_input))
#     # Run the graph
#     final_state = app.invoke(st.session_state.state)
#     st.session_state.state = final_state
#     # Truncate state to keep only recent messages
#     if len(st.session_state.state["messages"]) > MAX_HISTORY:
#         st.session_state.state["messages"] = st.session_state.state["messages"][-MAX_HISTORY:]
#     # Clear tool results after showing (optional)
#     st.session_state.state["tool_results"] = []
#     st.session_state.state["next_action"] = ""
#     st.rerun()

# # Sidebar: Clear chat button
# if st.sidebar.button("Clear Chat"):
#     st.session_state.state = {
#         "messages": [],
#         "tool_calls": [],
#         "tool_results": [],
#         "next_action": ""
#     }
#     st.rerun()

import streamlit as st
from langchain_core.messages import HumanMessage
from graph import app

MAX_HISTORY = 6

# Initialize session state
if "state" not in st.session_state:
    st.session_state.state = {
        "messages": [],
        "tool_calls": [],
        "tool_results": [],
        "next_action": "",
        "confidence": 0.0,
        "sources": [],
        "temperature": 0.7
    }

st.set_page_config(page_title="Local ChatGPT", page_icon="🤖")
st.title("🤖 Local ChatGPT (Ollama + LangGraph)")

# Sidebar: Parameters and metrics
with st.sidebar:
    st.header("Parameters")
    new_temp = st.slider(
        "Temperature",
        min_value=0.0,
        max_value=1.0,
        value=st.session_state.state["temperature"],
        step=0.05
    )
    if new_temp != st.session_state.state["temperature"]:
        st.session_state.state["temperature"] = new_temp
        st.success(f"Temperature set to {new_temp} (applies next turn)")

    st.metric("Confidence (last answer)", f"{st.session_state.state['confidence']:.2f}")
    st.write("Sources:", ", ".join(st.session_state.state["sources"]) or "None")

    if st.button("Clear Chat"):
        st.session_state.state = {
            "messages": [],
            "tool_calls": [],
            "tool_results": [],
            "next_action": "",
            "confidence": 0.0,
            "sources": [],
            "temperature": st.session_state.state["temperature"]
        }
        st.rerun()

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
user_input = st.chat_input("Ask something...")
if user_input:
    # Add user message
    st.session_state.state["messages"].append(HumanMessage(content=user_input))
    # Run the graph
    final_state = app.invoke(st.session_state.state)
    st.session_state.state = final_state
    # Truncate stored state to keep only recent messages
    if len(st.session_state.state["messages"]) > MAX_HISTORY:
        st.session_state.state["messages"] = st.session_state.state["messages"][-MAX_HISTORY:]
    # Clear tool results after showing (optional)
    st.session_state.state["tool_results"] = []
    st.session_state.state["next_action"] = ""
    st.rerun()