# # # # # # # from typing import TypedDict, List, Union
# # # # # # # from langchain_core.messages import HumanMessage, AIMessage

# # # # # # # class State(TypedDict):
# # # # # # #     messages: List[Union[HumanMessage, AIMessage]]

# # # # # # from typing import TypedDict, List, Union, Optional
# # # # # # from langchain_core.messages import HumanMessage, AIMessage

# # # # # # class State(TypedDict):
# # # # # #     messages: List[Union[HumanMessage, AIMessage]]
# # # # # #     need_retrieval: bool
# # # # # #     context: Optional[str]

# # # # # from typing import TypedDict, List, Union, Optional
# # # # # from langchain_core.messages import HumanMessage, AIMessage

# # # # # class State(TypedDict):
# # # # #     messages: List[Union[HumanMessage, AIMessage]]
# # # # #     context: Optional[str]

# # # # from typing import TypedDict, List, Union, Optional
# # # # from langchain_core.messages import HumanMessage, AIMessage

# # # # class State(TypedDict):
# # # #     messages: List[Union[HumanMessage, AIMessage]]
# # # #     context: Optional[str]
# # # #     need_retrieval: bool   # NEW

# # # from typing import TypedDict, List, Union, Optional
# # # from langchain_core.messages import HumanMessage, AIMessage

# # # class State(TypedDict):
# # #     messages: List[Union[HumanMessage, AIMessage]]
# # #     context: Optional[str]
# # #     need_retrieval: bool
# # #     validation_status: str          # "passed", "failed", "pending"
# # #     human_feedback: Optional[str]

# # from typing import TypedDict, List, Union, Optional
# # from langchain_core.messages import HumanMessage, AIMessage

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]
# #     context: Optional[str]
# #     need_retrieval: bool
# #     validation_status: str
# #     human_feedback: Optional[str]
# #     error_count: int
# #     error_message: str

from typing import TypedDict, List, Union, Optional
from langchain_core.messages import HumanMessage, AIMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]
#     handbook_context: Optional[str]   # from handbook retriever
#     web_context: Optional[str]        # from web retriever
#     need_retrieval: bool
#     validation_status: str
#     human_feedback: Optional[str]
#     error_count: int
#     error_message: str
#     next_node: Optional[str]

class State(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]
    handbook_context: Optional[str]
    web_context: Optional[str]
    context: Optional[str]           # combined context from merge
    need_retrieval: bool
    validation_status: str
    human_feedback: Optional[str]
    error_count: int
    error_message: str
    next_node: Optional[str]