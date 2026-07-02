from src.healing.locator_healer import LocatorHealer

def test_estore_locator_healing(locator_healer):
    with open("tests/test_estore.html") as f:
        html = f.read()
    # Heal a broken locator (e.g., old product card selector)
    result = locator_healer.heal(".old-product-class", html)
    assert result is not None