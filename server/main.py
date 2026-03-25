"""FastAPI backend for the file manager."""

import asyncio
import mimetypes
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from seed import seed_if_needed

BASE_DIR = Path(__file__).resolve().parent / "data"

MIME_OVERRIDES: dict[str, str] = {
    ".ts": "text/typescript",
    ".tsx": "text/typescript",
    ".jsx": "text/javascript",
    ".md": "text/markdown",
    ".yaml": "text/yaml",
    ".yml": "text/yaml",
    ".csv": "text/csv",
    ".sh": "application/x-sh",
    ".py": "text/x-python",
}


def guess_mime(name: str) -> str:
    suffix = Path(name).suffix.lower()
    if suffix in MIME_OVERRIDES:
        return MIME_OVERRIDES[suffix]
    mt, _ = mimetypes.guess_type(name)
    return mt or "application/octet-stream"


def safe_resolve(base: Path, user_path: str) -> Path:
    """Resolve user_path under base, rejecting traversal attempts."""
    if "\x00" in user_path:
        raise HTTPException(400, "Invalid path")
    cleaned = user_path.lstrip("/")
    resolved = (base / cleaned).resolve()
    if not str(resolved).startswith(str(base.resolve())):
        raise HTTPException(403, "Path traversal denied")
    return resolved


def iso_mtime(p: Path) -> str:
    ts = p.stat().st_mtime
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()


# ── App ──────────────────────────────────────────────────────────

app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    seed_if_needed(BASE_DIR)


@app.get("/files")
async def handle_files(
    path: str | None = None,
    fileName: str | None = None,
    t: str | None = None,
):
    await asyncio.sleep(2)
    if fileName:
        return read_file(fileName)
    if path:
        return list_directory(path)
    raise HTTPException(400, "Provide 'path' or 'fileName' parameter")


def list_directory(path: str) -> dict:
    dir_path = safe_resolve(BASE_DIR, path)
    if not dir_path.is_dir():
        raise HTTPException(404, f"Directory not found: {path}")

    files = []
    for entry in sorted(dir_path.iterdir(), key=lambda p: p.name):
        if entry.is_dir():
            files.append({
                "name": entry.name,
                "path": f"/{entry.relative_to(BASE_DIR).as_posix()}",
                "size": 0,
                "type": "directory",
                "lastModified": iso_mtime(entry),
            })
        else:
            files.append({
                "name": entry.name,
                "path": f"/{entry.relative_to(BASE_DIR).as_posix()}",
                "size": entry.stat().st_size,
                "type": "file",
                "lastModified": iso_mtime(entry),
                "mimeType": guess_mime(entry.name),
            })

    return {"success": True, "files": files, "totalCount": len(files)}


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"}
VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv", ".m4v"}

BINARY_EXTENSIONS = IMAGE_EXTENSIONS | VIDEO_EXTENSIONS


def read_file(file_name: str) -> dict | FileResponse:
    file_path = safe_resolve(BASE_DIR, file_name)
    if not file_path.is_file():
        raise HTTPException(404, f"File not found: {file_name}")

    # Return binary response for image/video files (matching target website behavior)
    if file_path.suffix.lower() in BINARY_EXTENSIONS:
        return FileResponse(
            path=file_path,
            media_type=guess_mime(file_path.name),
            filename=file_path.name,
            content_disposition_type="inline",
        )

    content = file_path.read_text(encoding="utf-8")
    return {
        "success": True,
        "file": {
            "name": file_path.name,
            "path": f"/{file_path.relative_to(BASE_DIR).as_posix()}",
            "size": file_path.stat().st_size,
            "content": content,
            "encoding": "utf8",
            "mimeType": guess_mime(file_path.name),
            "lastModified": iso_mtime(file_path),
        },
    }


@app.post("/files/upload")
async def upload_files(
    path: str = Form(...),
    files: list[UploadFile] = File(...),
):
    await asyncio.sleep(2)
    target = safe_resolve(BASE_DIR, path)
    target.mkdir(parents=True, exist_ok=True)

    results = []
    for f in files:
        content = await f.read()
        dest = target / f.filename
        dest.write_bytes(content)
        results.append({
            "filename": f.filename,
            "path": f"/{dest.relative_to(BASE_DIR).as_posix()}",
            "size": len(content),
            "mimetype": guess_mime(f.filename),
        })

    return {
        "success": True,
        "files": results,
        "count": len(results),
        "uploadPath": path,
    }
