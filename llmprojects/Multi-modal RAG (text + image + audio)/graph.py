# # # from langgraph.graph import StateGraph, START, END
# # # from state import State
# # # from nodes import llm_node

# # # graph = StateGraph(State)
# # # graph.add_node("llm", llm_node)
# # # graph.add_edge(START, "llm")
# # # graph.add_edge("llm", END)
# # # app = graph.compile()


# # from langgraph.graph import StateGraph, START, END
# # from state import State
# # from nodes import retriever_node, llm_node, image_processor_node   # <-- add image_processor_node

# # graph = StateGraph(State)
# # graph.add_node("retriever", retriever_node)
# # graph.add_node("llm", llm_node)
# # graph.add_node("image_processor", image_processor_node)
# # graph.add_edge(START, "retriever")
# # graph.add_edge("retriever", "image_processor")
# # graph.add_edge("image_processor", "llm")
# # graph.add_edge("llm", END)
# # app = graph.compile()

# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import retriever_node, image_processor_node, llm_node

# graph = StateGraph(State)
# graph.add_node("retriever", retriever_node)
# graph.add_node("image_processor", image_processor_node)
# graph.add_node("audio_processor", audio_processor_node)
# graph.add_node("llm", llm_node)


# graph.add_edge(START, "retriever")
# graph.add_edge("retriever", "image_processor")
# graph.add_edge("image_processor", "audio_processor")
# graph.add_edge("audio_processor", "llm")
# graph.add_edge("llm", END)

# app = graph.compile()

from langgraph.graph import StateGraph, START, END
from state import State
from nodes import retriever_node, image_processor_node, audio_processor_node, llm_node

graph = StateGraph(State)
graph.add_node("retriever", retriever_node)
graph.add_node("image_processor", image_processor_node)
graph.add_node("audio_processor", audio_processor_node)
graph.add_node("llm", llm_node)

graph.add_edge(START, "retriever")
graph.add_edge("retriever", "image_processor")
graph.add_edge("image_processor", "audio_processor")
graph.add_edge("audio_processor", "llm")
graph.add_edge("llm", END)

app = graph.compile()