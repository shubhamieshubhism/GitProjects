# from typing import TypedDict, List, Union
# from langchain_core.messages import HumanMessage, AIMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]

from typing import TypedDict, List, Annotated, Literal
from langchain_core.messages import BaseMessage
import operator

class State(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    next_action: str   # 'call_tool' or 'end'
    tool_calls: List[dict]
    final_answer: str