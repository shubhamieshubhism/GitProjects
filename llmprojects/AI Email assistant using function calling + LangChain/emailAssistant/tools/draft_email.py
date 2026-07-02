from langchain_core.tools import tool

@tool
def draft_email(recipient: str, subject: str, body: str) -> str:
    """
    Draft an email. Does not send it. Returns the draft content.
    """
    return f"DRAFT EMAIL\nTo: {recipient}\nSubject: {subject}\n\n{body}"