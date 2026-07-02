# # from typing import TypedDict, List, Union
# # from langchain_core.messages import HumanMessage, AIMessage

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]

# # from typing import TypedDict, List, Union
# # from langchain_core.messages import HumanMessage, AIMessage

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]

# from typing import TypedDict, List, Union, Optional
# from langchain_core.messages import HumanMessage, AIMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]
#     context: Optional[str]   # will hold the retrieved document text

# from typing import TypedDict, List, Union, Optional
# from langchain_core.messages import HumanMessage, AIMessage, BaseMessage

# class State(TypedDict):
#     messages: List[BaseMessage]
#     context: Optional[str]
#     next_action: str          # "call_tool" or "end"
#     tool_calls: List[dict]    # pending tool calls from the agent
#     scratchpad: str           # for ReAct intermediate steps

from typing import TypedDict, List, Optional
from langchain_core.messages import BaseMessage

class State(TypedDict):
    messages: List[BaseMessage]
    context: Optional[str]
    next_action: str
    tool_calls: List[dict]
    scratchpad: str