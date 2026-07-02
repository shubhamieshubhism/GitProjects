# # import asyncio
# # from mcp import ClientSession, StdioServerParameters
# # from mcp.client.stdio import stdio_client

# # class MCPTodoClient:
# #     """A synchronous wrapper around the async MCP client."""
# #     def __init__(self, server_script="server.py"):
# #         self.server_params = StdioServerParameters(command="python", args=[server_script])
# #         self.session = None
# #         self.read_stream = None
# #         self.write_stream = None
# #         self._loop = None

# #     def connect(self):
# #         """Start the client session (must be called before using tools)."""
# #         self._loop = asyncio.new_event_loop()
# #         asyncio.set_event_loop(self._loop)
# #         self._loop.run_until_complete(self._async_connect())

# #     async def _async_connect(self):
# #         self.read_stream, self.write_stream = await stdio_client(self.server_params).__anext__()
# #         self.session = await ClientSession(self.read_stream, self.write_stream).__aenter__()
# #         await self.session.initialize()

# #     def call_tool(self, name: str, arguments: dict) -> str:
# #         """Synchronously call an MCP tool."""
# #         result = self._loop.run_until_complete(
# #             self.session.call_tool(name, arguments=arguments)
# #         )
# #         # Return the first text content
# #         return result.content[0].text if result.content else ""

# #     def close(self):
# #         if self._loop:
# #             self._loop.close()

# import asyncio
# import threading
# from mcp import ClientSession, StdioServerParameters
# from mcp.client.stdio import stdio_client

# class MCPTodoClient:
#     def __init__(self, server_script="server.py"):
#         self.server_params = StdioServerParameters(command="python", args=[server_script])
#         self.session = None
#         self._loop = None
#         self._thread = None
#         self._ready = threading.Event()

#     def _run_async_client(self):
#         asyncio.set_event_loop(self._loop)
#         self._loop.run_until_complete(self._async_main())
#         self._loop.run_forever()

#     async def _async_main(self):
#         async with stdio_client(self.server_params) as (read_stream, write_stream):
#             async with ClientSession(read_stream, write_stream) as session:
#                 await session.initialize()
#                 self.session = session
#                 self._ready.set()
#                 # Keep the session alive indefinitely
#                 await asyncio.Future()

#     def connect(self):
#         if self._thread is not None:
#             return
#         self._loop = asyncio.new_event_loop()
#         self._thread = threading.Thread(target=self._run_async_client, daemon=True)
#         self._thread.start()
#         self._ready.wait()

#     def call_tool(self, name: str, arguments: dict) -> str:
#         if self.session is None:
#             raise RuntimeError("Client not connected")
#         future = asyncio.run_coroutine_threadsafe(
#             self.session.call_tool(name, arguments=arguments), self._loop
#         )
#         result = future.result()
#         return result.content[0].text if result.content else ""

import asyncio
import threading
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

class MCPTodoClient:
    def __init__(self, server_script="server.py"):
        self.server_params = StdioServerParameters(command="python", args=[server_script])
        self.session = None
        self._loop = None
        self._thread = None
        self._ready = threading.Event()

    def _run_async_client(self):
        asyncio.set_event_loop(self._loop)
        self._loop.run_until_complete(self._async_main())
        self._loop.run_forever()

    async def _async_main(self):
        async with stdio_client(self.server_params) as (read_stream, write_stream):
            async with ClientSession(read_stream, write_stream) as session:
                await session.initialize()
                self.session = session
                self._ready.set()
                # Keep the session alive indefinitely
                await asyncio.Future()

    def connect(self):
        if self._thread is not None:
            return
        self._loop = asyncio.new_event_loop()
        self._thread = threading.Thread(target=self._run_async_client, daemon=True)
        self._thread.start()
        self._ready.wait()

    def call_tool(self, name: str, arguments: dict) -> str:
        if self.session is None:
            raise RuntimeError("Client not connected")
        future = asyncio.run_coroutine_threadsafe(
            self.session.call_tool(name, arguments=arguments), self._loop
        )
        result = future.result()
        return result.content[0].text if result.content else ""