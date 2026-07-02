# # # from typing import TypedDict, List, Union
# # # from langchain_core.messages import HumanMessage, AIMessage

# # # class State(TypedDict):
# # #     messages: List[Union[HumanMessage, AIMessage]]

# from typing import TypedDict, List, Union, Optional, Dict, Any
# from langchain_core.messages import HumanMessage, AIMessage

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]
# #     tool_calls: List[Dict[str, Any]]      # pending tool calls from LLM
# #     tool_results: List[str]               # results from executed tools
# #     next_action: str                      # 'call_tool' or 'end'

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]
# #     tool_calls: List[Dict[str, Any]]
# #     tool_results: List[str]
# #     next_action: str
# #     iterations: int   # NEW – prevent infinite loops
    
    
# from typing import TypedDict, List, Union, Dict, Any
# from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage, SystemMessage]]
#     tool_calls: List[Dict[str, Any]]
#     tool_results: List[str]
#     next_action: str
#     iterations: int

from typing import TypedDict, List, Union, Dict, Any
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

class State(TypedDict):
    messages: List[Union[HumanMessage, AIMessage, SystemMessage]]
    tool_calls: List[Dict[str, Any]]
    tool_results: List[str]
    next_action: str
    iterations: int