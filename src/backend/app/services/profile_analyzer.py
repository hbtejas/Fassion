from PIL import Image
from google import genai
from pydantic import BaseModel
from typing import List, Optional
import instructor
from litellm import completion
from src.backend.app.config import settings
from src.backend.app.dependencies import deps
from src.backend.app.models.schemas import SkinToneBodyAnalysis
from src.backend.app.utils.image_utils import get_image_from_source


def analyze_user_appearance_from_image(image: Image.Image) -> SkinToneBodyAnalysis:
    """Analyze a user portrait image for skin tone, undertone, color palette, and body silhouette."""
    
    prompt = """You are a master fashion stylist and color theory expert.
Carefully inspect this portrait or full-body photo of the user:
1. Identify the user's skin tone (e.g., Fair, Medium, Wheatish, Olive, Dusky, or Deep).
2. Identify their undertone (Warm, Cool, or Neutral).
3. List 4 to 6 specific flattering colors and jewel/earth tones that will make their complexion radiate.
4. List 2 to 4 colors they should avoid or use sparingly (e.g., washed-out pastels or clashing neons).
5. Identify their body type/silhouette (e.g., Hourglass, Rectangle/Athletic, Pear/Triangle, Inverted Triangle, Apple/Round). If only upper body/face is visible, estimate based on shoulders and frame.
6. Provide 3 to 4 actionable silhouette tailoring guidelines (flattering necklines, waist definition, structural cuts).

Respond strictly adhering to the requested schema."""

    g_client = genai.Client()
    # Use Gemini multimodal structured generation
    response = g_client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=[image, prompt],
        config={
            "response_mime_type": "application/json",
            "response_schema": SkinToneBodyAnalysis,
        },
    )

    import json
    data = json.loads(response.text)
    return SkinToneBodyAnalysis(**data)


def create_analyze_user_appearance(session_id: str):
    """Factory to create the analyze_user_appearance tool bound to a session."""

    def analyze_user_appearance(focus: str = "all") -> str:
        """Analyze the user's uploaded photo for skin tone, undertone, flattering colors, and body silhouette.

        Args:
            focus: Specific aspect to focus on ("skin_tone", "body_type", or "all").

        Returns:
            A detailed analysis of skin tone, flattering color palette, colors to avoid, body silhouette, and tailoring advice.
        """
        model_source = deps.session_manager.get_model_source(session_id)
        if not model_source:
            # Check if user attached any photo in user_provided images
            store = deps.session_manager.get_session(session_id).image_source_store
            user_images = [src for src in store.values() if src != model_source]
            if user_images:
                model_source = user_images[0]
            else:
                return "[INFO] No user photo found. Ask the user to upload a photo or click 'Set My Photo' to analyze skin tone and body type."

        try:
            image = get_image_from_source(model_source.path, model_source.bbox)
            analysis = analyze_user_appearance_from_image(image)
            try:
                deps.session_manager.get_session(session_id).latest_analysis = analysis
            except Exception:
                pass
            
            output = f"Skin Tone: {analysis.skin_tone} ({analysis.undertone} undertone)\n"
            output += f"Flattering Colors: {', '.join(analysis.flattering_colors)}\n"
            output += f"Colors to Avoid: {', '.join(analysis.colors_to_avoid)}\n"
            output += f"Body Silhouette: {analysis.body_type}\n"
            output += "Tailoring & Fit Guidelines:\n"
            for tip in analysis.silhouette_tips:
                output += f"  - {tip}\n"
            return output
        except Exception as e:
            return f"[ERROR] Could not analyze photo: {str(e)}"

    return analyze_user_appearance
