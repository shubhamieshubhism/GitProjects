from langchain_core.tools import tool

@tool
def send_email(recipient: str, subject: str, body: str) -> str:
    """
    Send an email. This actually sends it (simulated here).
    In production, you would integrate with SMTP or an email API.
    """
    # Simulate sending
    return f"✅ Email sent successfully to {recipient} with subject '{subject}'."