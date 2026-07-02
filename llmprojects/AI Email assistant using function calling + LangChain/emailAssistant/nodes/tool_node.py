# from langchain_core.messages import ToolMessage
# from state import State
# from tools import draft_email

# TOOLS_MAP = {
#     "draft_email": draft_email,
# }

# def tool_node(state: State) -> dict:
#     tool_calls = state.get("tool_calls", [])
#     if not tool_calls:
#         return {"next_action": "end"}
    
#     results = []
#     for tc in tool_calls:
#         tool_name = tc.get("name")
#         tool_args = tc.get("args", {})
#         tool_func = TOOLS_MAP.get(tool_name)
#         if tool_func:
#             result = tool_func.invoke(tool_args)
#             tool_msg = ToolMessage(content=result, tool_call_id=tc.get("id", ""))
#             results.append(tool_msg)
#         else:
#             results.append(f"Error: unknown tool {tool_name}")
    
#     return {
#         "messages": results,
#         "next_action": "call_llm",  # go back to LLM with tool results
#         "tool_calls": []
#     }

# from langchain_core.messages import ToolMessage
# from state import State
# from tools import draft_email, send_email, search_emails

# TOOLS_MAP = {
#     "draft_email": draft_email,
#     "send_email": send_email,
#     "search_emails": search_emails,
# }

# def tool_node(state: State) -> dict:
#     tool_calls = state.get("tool_calls", [])
#     if not tool_calls:
#         return {"next_action": "end"}
    
#     results = []
#     for tc in tool_calls:
#         tool_name = tc.get("name")
#         tool_args = tc.get("args", {})
#         tool_func = TOOLS_MAP.get(tool_name)
#         if tool_func:
#             result = tool_func.invoke(tool_args)
#             tool_msg = ToolMessage(content=result, tool_call_id=tc.get("id", ""))
#             results.append(tool_msg)
#         else:
#             results.append(ToolMessage(content=f"Error: unknown tool {tool_name}", tool_call_id=tc.get("id", "")))
    
#     return {
#         "messages": results,
#         "next_action": "call_llm",
#         "tool_calls": []
#     }

from langgraph.types import interrupt
from langchain_core.messages import ToolMessage
from state import State
from tools import draft_email, send_email, search_emails

TOOLS_MAP = {
    "draft_email": draft_email,
    "send_email": send_email,
    "search_emails": search_emails,
}

def tool_node(state: State) -> dict:
    tool_calls = state.get("tool_calls", [])
    if not tool_calls:
        return {"next_action": "end"}
    
    results = []
    for tc in tool_calls:
        tool_name = tc.get("name")
        tool_args = tc.get("args", {})
        
        # INTERRUPT: if it's send_email, ask for confirmation
        if tool_name == "send_email":
            print(f"\n⚠️  [INTERRUPT] The assistant wants to send an email:")
            print(f"   To: {tool_args.get('recipient')}")
            print(f"   Subject: {tool_args.get('subject')}")
            print(f"   Body: {tool_args.get('body')}")
            
            # Wait for human input – this pauses the graph
            human_response = interrupt({
                "question": f"Send this email? (yes/no)",
                "tool_call": tc
            })
            
            if human_response.lower() != "yes":
                result = "❌ Email sending cancelled by user."
                tool_msg = ToolMessage(content=result, tool_call_id=tc.get("id", ""))
                results.append(tool_msg)
                continue  # skip actually sending
        
        # Execute the tool normally (or after confirmation)
        tool_func = TOOLS_MAP.get(tool_name)
        if tool_func:
            result = tool_func.invoke(tool_args)
            tool_msg = ToolMessage(content=result, tool_call_id=tc.get("id", ""))
            results.append(tool_msg)
        else:
            results.append(ToolMessage(content=f"Error: unknown tool {tool_name}", tool_call_id=tc.get("id", "")))
    
    return {
        "messages": results,
        "next_action": "call_llm",
        "tool_calls": []
    }