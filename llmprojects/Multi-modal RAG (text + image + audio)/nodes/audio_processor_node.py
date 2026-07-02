import whisper
from state import State

# Load Whisper model once (can be "tiny", "base", "small", "medium", "large")
model = whisper.load_model("base")

def audio_processor_node(state: State) -> dict:
    audio_path = state.get("audio_path")
    if not audio_path:
        return {"audio_transcript": None}
    result = model.transcribe(audio_path)
    transcript = result["text"]
    return {"audio_transcript": transcript}