# from PIL import Image
# from transformers import BlipProcessor, BlipForConditionalGeneration
# from state import State

# # Load BLIP model once
# processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
# model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# def image_processor_node(state: State) -> dict:
#     image_path = state.get("image_path")
#     if not image_path:
#         return {"image_caption": None}
#     image = Image.open(image_path).convert("RGB")
#     inputs = processor(image, return_tensors="pt")
#     out = model.generate(**inputs)
#     caption = processor.decode(out[0], skip_special_tokens=True)
#     return {"image_caption": caption}

from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from state import State

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def image_processor_node(state: State) -> dict:
    image_path = state.get("image_path")
    if not image_path:
        return {"image_caption": None}
    image = Image.open(image_path).convert("RGB")
    inputs = processor(image, return_tensors="pt")
    out = model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return {"image_caption": caption}