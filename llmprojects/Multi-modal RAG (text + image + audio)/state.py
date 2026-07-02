# # from typing import TypedDict, List, Union
# # from langchain_core.messages import HumanMessage, AIMessage

# # class State(TypedDict):
# #     messages: List[Union[HumanMessage, AIMessage]]
# from typing import TypedDict, List, Union, Optional
# from langchain_core.messages import HumanMessage, AIMessage

# class State(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]
#     retrieved_docs: Optional[List[str]]   # NEW
#     image_path: Optional[str]
#     image_caption: Optional[str]

from typing import TypedDict, List, Union, Optional
from langchain_core.messages import HumanMessage, AIMessage

class State(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]
    retrieved_docs: Optional[List[str]]
    image_path: Optional[str]          # path to uploaded image
    image_caption: Optional[str]       # generated caption
    audio_path: Optional[str]
    audio_transcript: Optional[str]