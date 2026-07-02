# import asyncio
# from mcp import ClientSession, StdioServerParameters
# from mcp.client.stdio import stdio_client

# async def main():
#     # Spawn the server process
#     server_params = StdioServerParameters(
#         command="python",
#         args=["server.py"]
#     )
    
#     async with stdio_client(server_params) as (read_stream, write_stream):
#         async with ClientSession(read_stream, write_stream) as session:
#             await session.initialize()
            
#             # list_tools returns a ListToolsResult object, which has a 'tools' attribute
#             tools_result = await session.list_tools()
#             tools = tools_result.tools
#             print("Available tools:", [tool.name for tool in tools])
            
#             # Call the add_todo tool
#             result = await session.call_tool("add_todo", arguments={"task": "Buy milk"})
#             print("Result:", result.content[0].text)
            
#             result2 = await session.call_tool("add_todo", arguments={"task": "Write report"})
#             print("Result:", result2.content[0].text)

# if __name__ == "__main__":
#     asyncio.run(main())

import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    server_params = StdioServerParameters(command="python", args=["server.py"])
    async with stdio_client(server_params) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            
            # List tools
            tools_result = await session.list_tools()
            print("Available tools:", [t.name for t in tools_result.tools])
            
            # Add a few todos
            await session.call_tool("add_todo", arguments={"task": "Buy milk"})
            await session.call_tool("add_todo", arguments={"task": "Write report"})
            
            # List todos
            list_result = await session.call_tool("list_todos", arguments={})
            print("\nCurrent TODOs:")
            print(list_result.content[0].text)
            
            # Delete the first todo (ID 1)
            await session.call_tool("delete_todo", arguments={"todo_id": 1})
            
            # List again
            list_result = await session.call_tool("list_todos", arguments={})
            print("\nAfter deletion:")
            print(list_result.content[0].text)

if __name__ == "__main__":
    asyncio.run(main())