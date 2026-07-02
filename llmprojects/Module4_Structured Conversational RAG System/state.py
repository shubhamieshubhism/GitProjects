# from typing import TypedDict, List, Union
# from langchain_core.messages import HumanMessage, AIMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]

# from typing import TypedDict, List, Union
# from langchain_core.messages import HumanMessage, AIMessage
# from langchain_core.documents import Document

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]
#     context: List[Document]   # retrieved chunks

from typing import TypedDict, List, Union, Annotated
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, BaseMessage
from langchain_core.documents import Document
import operator

class State(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    context: List[Document]   # may be unused now, but keep for compatibility
    next_action: str
    tool_calls: List[dict]
    final_answer: str