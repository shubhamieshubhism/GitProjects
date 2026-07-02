from Module9_HnadsOn.tests.echo_agent import app
from langchain_core.messages import HumanMessage

state = {"messages": [HumanMessage(content="Hello, respond with 'OK'")]}
result = app.invoke(state)
print(result["messages"][-1].content)   