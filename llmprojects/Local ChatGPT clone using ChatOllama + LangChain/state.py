# # from typing import TypedDict, List, Union
# # from langchain_core.messages import HumanMessage, AIMessage

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]
    
# from typing import TypedDict, List, Union, Dict, Any, Optional
# from langchain_core.messages import HumanMessage, AIMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]
#     tool_calls: List[Dict[str, Any]]
#     tool_results: List[str]
#     next_action: str

from typing import TypedDict, List, Union, Dict, Any, Optional
from langchain_core.messages import HumanMessage, AIMessage

class State(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]
    tool_calls: List[Dict[str, Any]]
    tool_results: List[str]
    next_action: str
    confidence: float          # 0-1 confidence of last answer
    sources: List[str]         # source references (e.g., tool names)
    temperature: float         # current temperature setting