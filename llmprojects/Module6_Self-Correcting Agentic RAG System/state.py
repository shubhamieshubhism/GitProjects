# # from typing import TypedDict, List, Union
# # from langchain_core.messages import HumanMessage, AIMessage

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]

# from typing import TypedDict, List, Union, Dict, Any, Optional
from langchain_core.messages import HumanMessage, AIMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]
#     tool_calls: List[Dict[str, Any]]
#     tool_results: List[str]
#     context: Optional[str]
#     next_action: str

from typing import TypedDict, List, Union, Dict, Any, Optional

class State(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]
    tool_calls: List[Dict[str, Any]]
    tool_results: List[str]
    context: Optional[str]
    next_action: str
    retry_count: int
    error_message: Optional[str]
    max_retries: int