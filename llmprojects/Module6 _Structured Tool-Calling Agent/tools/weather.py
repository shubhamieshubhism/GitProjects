import random

def get_weather(city: str) -> str:
    """Mock weather API."""
    # In production, call a real API
    temp = random.randint(10, 30)
    condition = random.choice(["sunny", "cloudy", "rainy"])
    return f"Weather in {city}: {temp}°C, {condition}."