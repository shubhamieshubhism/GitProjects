# from langchain_community.chat_models import ChatOllama
# from state import State

# # Initialize Ollama (make sure you have pulled a model, e.g., `ollama pull llama3.1`)
# llm = ChatOllama(model="llama3.1", temperature=0)

# def call_llm_node(state: State) -> dict:
#     """Send the conversation to Ollama and return the AI reply."""
#     conversation = state["messages"]
#     response = llm.invoke(conversation)
#     # Append the new AI message to the existing list
#     return {"messages": conversation + [response]}

# from langchain_community.chat_models import ChatOllama
# from langchain_core.prompts import ChatPromptTemplate
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0)

# def call_llm_node(state: State) -> dict:
#     conversation = state["messages"]
#     context_docs = state.get("context", [])
#     # Format context as a single string
#     context_str = "\n\n".join([doc.page_content for doc in context_docs]) if context_docs else "No relevant documents found."
    
#     # Create a prompt that includes context
#     prompt = ChatPromptTemplate.from_messages([
#         ("system", "You are a helpful assistant. Answer based on the following context when possible.\n\nContext:\n{context}"),
#         ("human", "{input}")
#     ])
#     # Get the last user message
#     last_user_msg = conversation[-1].content
#     formatted_prompt = prompt.format_messages(context=context_str, input=last_user_msg)
#     response = llm.invoke(formatted_prompt)
#     # Append the AI reply to messages
#     return {"messages": conversation + [response]}


# from langchain_community.chat_models import ChatOllama
# from langchain_core.prompts import ChatPromptTemplate
# from state import State

# llm = ChatOllama(model="llama3.1", temperature=0)

# def call_llm_node(state: State) -> dict:
#     conversation = state["messages"]
#     context_docs = state.get("context", [])
#     context_str = "\n\n".join([doc.page_content for doc in context_docs]) if context_docs else "No relevant documents found."
    
#     # Debug print
#     print(f"\n[DEBUG] Context sent to LLM:\n{context_str}\n")
    
#     prompt = ChatPromptTemplate.from_messages([
#         ("system", "You are a company policy bot. Answer the user's question **using only the following context**. Do not add any external knowledge. If the context does not contain the answer, say: 'I don't have that information.'\n\nContext:\n{context}"),
#         ("human", "{input}")
#     ])
#     last_user_msg = conversation[-1].content
#     formatted_prompt = prompt.format_messages(context=context_str, input=last_user_msg)
#     response = llm.invoke(formatted_prompt)
#     return {"messages": conversation + [response]}



from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator
from state import State

# Define the structured output schema
class StructuredAnswer(BaseModel):
    answer: str = Field(description="The answer to the user's question")
    sources: list[str] = Field(default=[], description="List of source document IDs or filenames")
    confidence: float = Field(ge=0, le=1, description="Confidence score (0-1)")

    @validator('confidence')
    def validate_confidence(cls, v):
        if v < 0.7:
            raise ValueError(f"Low confidence answer ({v}) – consider rejecting")
        return v

parser = PydanticOutputParser(pydantic_object=StructuredAnswer)
format_instructions = parser.get_format_instructions()

llm = ChatOllama(model="llama3.1", temperature=0)

def call_llm_node(state: State) -> dict:
    conversation = state["messages"]
    context_docs = state.get("context", [])
    context_str = "\n\n".join([doc.page_content for doc in context_docs]) if context_docs else "No relevant documents found."
    
    # Prompt with full chat history and structured output instructions
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a company policy bot. Answer using only the context. Provide a structured JSON output with 'answer', 'sources' (list of strings, e.g., ['handbook.txt']), and 'confidence' (float between 0 and 1).\nContext:\n{context}\n\n{format_instructions}"),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}")
    ])
    
    # Prepare the chat history (all messages except the last user message)
    chat_history = conversation[:-1]  # exclude the latest user message
    last_user_msg = conversation[-1].content
    
    formatted_prompt = prompt.format_messages(
        context=context_str,
        format_instructions=format_instructions,
        chat_history=chat_history,
        input=last_user_msg
    )
    
    response = llm.invoke(formatted_prompt)
    
    # Parse the response into our structured model
    try:
        structured = parser.parse(response.content)
        # If we get here, parsing succeeded and confidence is >= 0.7 (due to validator)
        # Convert to a readable message for the user
        answer_text = structured.answer
        if structured.sources:
            answer_text += f"\n\nSources: {', '.join(structured.sources)}"
        answer_text += f"\n\nConfidence: {structured.confidence}"
    except Exception as e:
        # Parsing failed or low confidence – return a fallback message
        answer_text = f"Error: Could not parse structured answer. {e}"
        structured = None
    
    # We need to return an AIMessage with the text content (for display)
    from langchain_core.messages import AIMessage
    ai_msg = AIMessage(content=answer_text)
    
    return {"messages": conversation + [ai_msg]}