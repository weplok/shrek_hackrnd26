import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent
STORIES_DIR = BASE_DIR / "stories"
INDEX_FILE = BASE_DIR / "index.html"

STORY_MAX_LENGTH = 10_000

app = FastAPI(title="Болото Шрека")

STORIES_DIR.mkdir(exist_ok=True)


class StoryIn(BaseModel):
    story: str = Field(min_length=1, max_length=STORY_MAX_LENGTH)


def _safe_filename(stamp: str, story_id: str) -> str:
    return f"story_{stamp}_{story_id}.txt"


@app.get("/")
def index():
    return FileResponse(INDEX_FILE, media_type="text/html")


@app.post("/api/stories")
def create_story(payload: StoryIn):
    story = payload.story.strip()
    if not story:
        raise HTTPException(status_code=422, detail="История не может быть пустой")

    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    story_id = uuid.uuid4().hex[:8]
    path = STORIES_DIR / _safe_filename(stamp, story_id)

    first_line = story.splitlines()[0][:60]
    slug = re.sub(r"[^\wа-яёА-ЯЁ-]+", "-", first_line).strip("-").lower()[:40]
    if slug:
        path = STORIES_DIR / f"story_{stamp}_{slug}_{story_id}.txt"

    counter = 1
    while path.exists():
        path = STORIES_DIR / f"{path.stem}_{counter}{path.suffix}"
        counter += 1

    path.write_text(story + "\n", encoding="utf-8")
    return {"ok": True, "file": path.name}
