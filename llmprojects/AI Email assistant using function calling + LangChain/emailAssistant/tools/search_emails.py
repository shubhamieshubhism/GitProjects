from langchain_core.tools import tool

# Mock email database
MOCK_EMAILS = [
    {"subject": "Meeting tomorrow", "from": "john@example.com", "body": "Let's meet at 10am.", "date": "2025-05-20"},
    {"subject": "Budget proposal", "from": "finance@example.com", "body": "Please review the Q3 budget.", "date": "2025-05-19"},
    {"subject": "Project update", "from": "alice@example.com", "body": "We are on track for launch.", "date": "2025-05-18"},
]

@tool
def search_emails(query: str, max_results: int = 3) -> str:
    """
    Search past emails by keyword. Returns matching emails.
    """
    query_lower = query.lower()
    matches = []
    for email in MOCK_EMAILS:
        if (query_lower in email["subject"].lower() or 
            query_lower in email["body"].lower() or
            query_lower in email["from"].lower()):
            matches.append(email)
    results = matches[:max_results]
    if not results:
        return f"No emails found for '{query}'."
    
    output = f"Found {len(results)} email(s):\n\n"
    for idx, email in enumerate(results, 1):
        output += f"{idx}. From: {email['from']}\n   Subject: {email['subject']}\n   Date: {email['date']}\n   Body: {email['body']}\n\n"
    return output