# import anthropic
# import os
# from typing import List, Optional
# import base64
# import logging

# logger = logging.getLogger(__name__)

# class LLMClient:
#     def __init__(self):
#         api_key = os.getenv("ANTHROPIC_API_KEY")
#         if not api_key:
#             raise ValueError("ANTHROPIC_API_KEY environment variable not set")
#         self.client = anthropic.Anthropic(api_key=api_key)

#     def generate(self, prompt: str, max_tokens: int = 1500, images: Optional[List[str]] = None) -> str:
#         """
#         Send a prompt to Claude. If images are provided, use vision capabilities.
#         images: list of base64-encoded image strings.
#         """
#         try:
#             if images:
#                 content = [{"type": "text", "text": prompt}]
#                 for img_b64 in images:
#                     content.append({
#                         "type": "image",
#                         "source": {
#                             "type": "base64",
#                             "media_type": "image/png",
#                             "data": img_b64
#                         }
#                     })
#                 response = self.client.messages.create(
#                     model="claude-3-5-sonnet-20241022",
#                     max_tokens=max_tokens,
#                     messages=[{"role": "user", "content": content}]
#                 )
#             else:
#                 response = self.client.messages.create(
#                     model="claude-3-5-sonnet-20241022",
#                     max_tokens=max_tokens,
#                     messages=[{"role": "user", "content": prompt}]
#                 )
#             return response.content[0].text
#         except Exception as e:
#             logger.error(f"LLM generation error: {e}")
#             raise
import os
import requests
import json
import base64
import logging
from typing import List, Optional, Union

logger = logging.getLogger(__name__)

class LLMClient:
    """
    Client for communicating with a local Ollama server.
    Supports text-only and vision (multimodal) models.
    """
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "llama3.2")
        self.vision_model = os.getenv("OLLAMA_VISION_MODEL", "llava")
        self.timeout = int(os.getenv("OLLAMA_TIMEOUT", "120"))

    def generate(
        self,
        prompt: str,
        max_tokens: int = 1500,
        images: Optional[List[str]] = None,
        temperature: float = 0.7
    ) -> str:
        """
        Send a prompt to Ollama. If images are provided, use the vision model.
        images: list of base64-encoded image strings.
        """
        try:
            if images:
                # Use vision model (e.g., llava, bakllava)
                model = self.vision_model
                # Build content with images
                content = []
                for img_b64 in images:
                    content.append({
                        "type": "image",
                        "image": img_b64  # Ollama expects raw base64 (without data:image/...)
                    })
                content.append({"type": "text", "text": prompt})
                payload = {
                    "model": model,
                    "messages": [{"role": "user", "content": content}],
                    "stream": False,
                    "options": {
                        "num_predict": max_tokens,
                        "temperature": temperature
                    }
                }
            else:
                payload = {
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": False,
                    "options": {
                        "num_predict": max_tokens,
                        "temperature": temperature
                    }
                }

            response = requests.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=self.timeout
            )
            response.raise_for_status()
            data = response.json()
            return data["message"]["content"]

        except Exception as e:
            logger.error(f"Ollama generation error: {e}")
            raise RuntimeError(f"Ollama request failed: {e}")