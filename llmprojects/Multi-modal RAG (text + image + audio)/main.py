# # # from langchain_core.messages import HumanMessage
# # # from graph import app

# # # def main():
# # #     print("Multi‑modal RAG (Step 1) - type 'quit' to exit")
# # #     #state = {"messages": []}
# # #     state = {"messages": [], "retrieved_docs": None}
# # #     while True:
# # #         user_input = input("\nYou: ")
# # #         if user_input.lower() == "quit":
# # #             break
# # #         state["messages"].append(HumanMessage(content=user_input))
# # #         final_state = app.invoke(state)
# # #         state = final_state
# # #         print(f"\nAI: {state['messages'][-1].content}")

# # # if __name__ == "__main__":
# # #     main()

# # from langchain_core.messages import HumanMessage
# # from graph import app
# # import os

# # def main():
# #     print("Multi‑modal RAG (Step 3) - type 'quit' to exit, /image <path> to add an image")
# #     state = {
# #         "messages": [],
# #         "retrieved_docs": None,
# #         "image_path": None,
# #         "image_caption": None
# #     }
# #     while True:
# #         user_input = input("\nYou: ")
# #         if user_input.lower() == "quit":
# #             break
# #         if user_input.lower().startswith("/image"):
# #             parts = user_input.split(maxsplit=1)
# #             if len(parts) == 2:
# #                 img_path = parts[1].strip()
# #                 if os.path.exists(img_path):
# #                     state["image_path"] = img_path
# #                     print(f"Image loaded: {img_path}")
# #                 else:
# #                     print(f"File not found: {img_path}")
# #             else:
# #                 print("Usage: /image <filepath>")
# #             continue
        
# #         # Inside the loop, add:
# #         if user_input.lower().startswith("/audio"):
# #             parts = user_input.split(maxsplit=1)
# #             if len(parts) == 2:
# #                 audio_path = parts[1].strip()
# #                 if os.path.exists(audio_path):
# #                     state["audio_path"] = audio_path
# #                     print(f"Audio loaded: {audio_path}")
# #                 else:
# #                     print(f"File not found: {audio_path}")
# #             else:
# #                 print("Usage: /audio <filepath>")
# #             continue

# #         # Normal text query
# #         state["messages"].append(HumanMessage(content=user_input))
# #         final_state = app.invoke(state)
# #         state = final_state

# #         # Show image caption if generated
# #         if state.get("image_caption"):
# #             print(f"\n[Image Caption]: {state['image_caption']}")
# #             # Clear after showing to avoid repeating
# #             state["image_caption"] = None

# #         # Show retrieved documents and AI answer
# #         if state.get("retrieved_docs"):
# #             print("\n[Retrieved Context]:")
# #             for i, doc in enumerate(state["retrieved_docs"], 1):
# #                 print(f"{i}. {doc[:200]}...")
# #         print(f"\nAI: {state['messages'][-1].content}")

# #         # Reset image path after processing (optional)
# #         state["image_path"] = None

# # if __name__ == "__main__":
# #     main()

# import os

# DATA_DIR = "data"

# def resolve_media_path(filename):
#     """If filename is just a name (no slashes), assume it's in DATA_DIR."""
#     if os.path.sep not in filename and not os.path.isabs(filename):
#         return os.path.join(DATA_DIR, filename)
#     return filename

# # Inside the loop, when handling /image:
# if user_input.lower().startswith("/image"):
#     parts = user_input.split(maxsplit=1)
#     if len(parts) == 2:
#         img_path = resolve_media_path(parts[1].strip())
#         if os.path.exists(img_path):
#             state["image_path"] = img_path
#             print(f"Image loaded: {img_path}")
#         else:
#             print(f"File not found: {img_path}")
#     else:
#         print("Usage: /image <filename> (looks in data/ folder)")

# # Similarly for /audio:
# if user_input.lower().startswith("/audio"):
#     parts = user_input.split(maxsplit=1)
#     if len(parts) == 2:
#         audio_path = resolve_media_path(parts[1].strip())
#         if os.path.exists(audio_path):
#             state["audio_path"] = audio_path
#             print(f"Audio loaded: {audio_path}")
#         else:
#             print(f"File not found: {audio_path}")
#     else:
#         print("Usage: /audio <filename> (looks in data/ folder)")

from langchain_core.messages import HumanMessage
from graph import app
import os

DATA_DIR = "data"

def resolve_media_path(filename):
    """If filename is just a name (no slashes), assume it's in DATA_DIR."""
    if os.path.sep not in filename and not os.path.isabs(filename):
        return os.path.join(DATA_DIR, filename)
    return filename

def main():
    print("Multi‑modal RAG (Step 4) - type 'quit' to exit")
    print("Commands: /image <filename>  |  /audio <filename>  |  /clear")
    state = {
        "messages": [],
        "retrieved_docs": None,
        "image_path": None,
        "image_caption": None,
        "audio_path": None,
        "audio_transcript": None
    }
    while True:
        user_input = input("\nYou: ").strip()
        if not user_input:
            continue
        if user_input.lower() == "quit":
            break
        if user_input.lower() == "/clear":
            state = {
                "messages": [],
                "retrieved_docs": None,
                "image_path": None,
                "image_caption": None,
                "audio_path": None,
                "audio_transcript": None
            }
            print("Conversation cleared.")
            continue

        # Handle /image command
        if user_input.lower().startswith("/image"):
            parts = user_input.split(maxsplit=1)
            if len(parts) == 2:
                img_path = resolve_media_path(parts[1].strip())
                if os.path.exists(img_path):
                    state["image_path"] = img_path
                    print(f"Image loaded: {img_path}")
                else:
                    print(f"File not found: {img_path}")
            else:
                print("Usage: /image <filename> (looks in data/ folder)")
            continue

        # Handle /audio command
        if user_input.lower().startswith("/audio"):
            parts = user_input.split(maxsplit=1)
            if len(parts) == 2:
                audio_path = resolve_media_path(parts[1].strip())
                if os.path.exists(audio_path):
                    state["audio_path"] = audio_path
                    print(f"Audio loaded: {audio_path}")
                else:
                    print(f"File not found: {audio_path}")
            else:
                print("Usage: /audio <filename> (looks in data/ folder)")
            continue

        # Normal text query
        state["messages"].append(HumanMessage(content=user_input))
        final_state = app.invoke(state)
        state = final_state

        # Print image caption if generated
        if state.get("image_caption"):
            print(f"\n[Image Caption]: {state['image_caption']}")
            state["image_caption"] = None  # avoid repeating
        # Print audio transcript if generated
        if state.get("audio_transcript"):
            print(f"\n[Audio Transcript]: {state['audio_transcript']}")
            state["audio_transcript"] = None

        # Print retrieved documents (optional)
        if state.get("retrieved_docs"):
            print("\n[Retrieved Context]:")
            for i, doc in enumerate(state["retrieved_docs"], 1):
                print(f"{i}. {doc[:200]}...")

        # Print AI answer
        print(f"\nAI: {state['messages'][-1].content}")

        # Reset media paths after processing (optional)
        state["image_path"] = None
        state["audio_path"] = None

if __name__ == "__main__":
    main()