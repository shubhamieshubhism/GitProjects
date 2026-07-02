# # # from typing import TypedDict, List
# # # from langchain_core.messages import HumanMessage, AIMessage

# # # class State(TypedDict):
# # #     messages: List[HumanMessage | AIMessage]

# # # from typing import TypedDict, List, Union
# # # from langchain_core.messages import HumanMessage, AIMessage

# # # class State(TypedDict):
# # #     messages: List[Union[HumanMessage, AIMessage]]

# # from typing import TypedDict, List, Union
# # from langchain_core.messages import HumanMessage, AIMessage

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]
# #     next_node: str   # tells the graph where to go next

# from typing import TypedDict, List, Union
# from langchain_core.messages import HumanMessage, AIMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]
#     next_node: str
#     error_count: int
#     error_message: str

# from typing import TypedDict, List, Union
# from langchain_core.messages import HumanMessage, AIMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]
#     next_node: str
#     error_count: int
#     error_message: str
#     approved: bool   # whether user approved the action

from typing import TypedDict, List, Union
from langchain_core.messages import HumanMessage, AIMessage

class State(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]
    approved: bool
    error_count: int
    error_message: str