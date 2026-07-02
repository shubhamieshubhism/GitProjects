# # # import pytest
# # # from src.healing.locator_healer import LocatorHealer

# # # def test_healer_fallback(locator_healer):
# # #     # If no healing possible, returns original locator
# # #     result = locator_healer.heal("#old-id", "<html><body></body></html>")
# # #     assert result == "#old-id"

# # # def test_healer_with_dom(locator_healer):
# # #     dom = """
# # #     <html>
# # #       <body>
# # #         <button id="new-id">Submit</button>
# # #       </body>
# # #     </html>
# # #     """
# # #     result = locator_healer.heal("#old-id", dom)
# # #     # In real scenario, AI might return a new locator; here we just test it runs.
# # #     assert result is not None
# # import pytest
# # from src.healing.locator_healer import LocatorHealer

# # def test_healer_fallback(locator_healer):
# #     """If no healing possible, returns original locator."""
# #     # The mock LLM will return a locator, but we also test the fallback if None.
# #     # We'll simulate that the heuristic returns None by patching.
# #     original_find = locator_healer.heuristic.find_element
# #     locator_healer.heuristic.find_element = lambda loc, dom, img: None
# #     result = locator_healer.heal("#old-id", "<html><body></body></html>")
# #     assert result == "#old-id"
# #     locator_healer.heuristic.find_element = original_find  # restore

# # def test_healer_returns_new_locator_from_llm(locator_healer):
# #     dom = """
# #     <html>
# #       <body>
# #         <button id="new-id">Submit</button>
# #       </body>
# #     </html>
# #     """
# #     # The mock LLM is configured to return "#new-id" in conftest.py
# #     result = locator_healer.heal("#old-id", dom)
# #     assert result == "#new-id"

# import pytest
# from src.healing.locator_healer import LocatorHealer

# def test_healer_fallback(locator_healer):
#     """If no healing possible, returns original locator."""
#     # Simulate heuristic returning None
#     original_find = locator_healer.heuristic.find_element
#     # The signature is (locator, dom, screenshot)
#     locator_healer.heuristic.find_element = lambda loc, dom, img: None
#     result = locator_healer.heal("#old-id", "<html><body></body></html>")
#     assert result == "#old-id"
#     locator_healer.heuristic.find_element = original_find

# def test_healer_returns_new_locator_from_llm(locator_healer):
#     dom = """
#     <html>
#       <body>
#         <button id="new-id">Submit</button>
#       </body>
#     </html>
#     """
#     # The patch will return '#new-id' from the mock
#     result = locator_healer.heal("#old-id", dom)
#     assert result == "#new-id"

import pytest
from src.healing.locator_healer import LocatorHealer

def test_healer_fallback(locator_healer):
    """If no healing possible, returns original locator."""
    original_find = locator_healer.heuristic.find_element
    # Lambda must accept exactly 2 arguments (locator, dom) because that's how it's called.
    locator_healer.heuristic.find_element = lambda loc, dom: None
    result = locator_healer.heal("#old-id", "<html><body></body></html>")
    assert result == "#old-id"
    locator_healer.heuristic.find_element = original_find

def test_healer_returns_new_locator_from_llm(locator_healer):
    dom = """
    <html>
      <body>
        <button id="new-id">Submit</button>
      </body>
    </html>
    """
    result = locator_healer.heal("#old-id", dom)
    assert result == "#new-id"