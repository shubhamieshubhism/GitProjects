# test_main.py
print("Starting...")
from graph import app
print("Imported graph")
def main():
    print("Inside main")
    print("AI Assistant - type 'quit' to exit")
    state = {"messages": []}
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            break
        print(f"User said: {user_input}")

if __name__ == "__main__":
    print("Calling main()")
    main()