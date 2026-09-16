from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.backend.app.dependencies import deps
from src.backend.app.config import settings
from qdrant_client import QdrantClient
from transformers import CLIPModel, CLIPProcessor
from src.backend.app.services.session import SessionManager
from src.backend.app.models.schemas import ChatRequest, SessionDataResponse
from src.backend.app.services.graph import invoke_graph
from src.backend.app.prompt_manager import PromptManager
from pydantic import BaseModel
import torch


@asynccontextmanager
async def lifespan(app: FastAPI):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    deps.qdrant_client = QdrantClient(url=settings.qdrant_url, check_compatibility=False)
    deps.clip_model = CLIPModel.from_pretrained(settings.clip_model_name).to(device)
    deps.clip_processor = CLIPProcessor.from_pretrained(settings.clip_model_name)
    deps.session_manager = SessionManager()
    deps.prompt_manager = PromptManager()

    yield

    deps.qdrant_client.close()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_qdrant_client() -> QdrantClient:
    return deps.qdrant_client


def get_clip_model():
    return deps.clip_model, deps.clip_processor


@app.post("/chat")
async def chat(
        request: ChatRequest,
        qdrant_client: QdrantClient = Depends(get_qdrant_client),
        clip: tuple = Depends(get_clip_model),
):
    return invoke_graph(request, qdrant_client, clip)


@app.get("/session/{session_id}")
async def get_session(session_id: str):
    session_data = deps.session_manager.get_session_data(session_id)
    if session_data is None:
        raise HTTPException(status_code=404, detail="Session not found")

    return session_data


@app.get("/wardrobe")
async def get_wardrobe(qdrant_client: QdrantClient = Depends(get_qdrant_client)):
    try:
        points, _ = qdrant_client.scroll(
            collection_name=settings.collection_name,
            limit=50,
            with_payload=True,
        )
        items = []
        for p in points:
            items.append({
                "id": p.id,
                "label": p.payload.get("label", "Fashion Item"),
                "image_url": p.payload.get("image_url"),
                "bbox": p.payload.get("bbox"),
            })
        return {"items": items, "total": len(items)}
    except Exception as e:
        return {"items": [], "total": 0, "error": str(e)}


class ProfileAnalysisRequest(BaseModel):
    image_url: str


@app.post("/analyze-profile")
async def analyze_profile(req: ProfileAnalysisRequest):
    from src.backend.app.services.profile_analyzer import analyze_user_appearance_from_image
    from src.backend.app.utils.image_utils import get_image_from_source
    try:
        image = get_image_from_source(req.image_url, None)
        analysis = analyze_user_appearance_from_image(image)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

