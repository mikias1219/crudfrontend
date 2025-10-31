# main.py
from fastapi import FastAPI, Form, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import shutil
import os
from typing import Optional

from models import Album, Song
from database import Base, SessionLocal, engine
import logging

logger = logging.getLogger(__name__)

# ---------------- Database Setup ----------------
# Try to create tables, but don't fail if database is not available
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified successfully")
except Exception as e:
    logger.warning(f"Could not create database tables (database may not be running): {e}")

# ---------------- App Setup ----------------
app = FastAPI(title="Music Library API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder for uploaded files
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Serve static files
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- GET All Albums ----------------
@app.get("/api/albums/all")
async def get_all_albums(db: Session = Depends(get_db)):
    try:
        albums = db.query(Album).all()
        return [
            {
                "Album_id": album.Album_id,
                "Album_title": album.Album_title,
                "Total_tracks": album.Total_tracks,
                "audio_url": f"/static/{os.path.basename(album.audio_file)}" if album.audio_file else None
            }
            for album in albums
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- POST Endpoint for Album Creation ----------------
@app.post("/api/albums/create")
async def create_album(
    Album_title: str = Form(...),
    Total_tracks: int = Form(...),
    audio: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        file_path = None
        if audio:
            # Save audio file
            file_path = os.path.join(UPLOAD_DIR, audio.filename)
            with open(file_path, "wb") as f:
                shutil.copyfileobj(audio.file, f)

        # Insert into PostgreSQL
        new_album = Album(
            Album_title=Album_title,
            Total_tracks=Total_tracks,
            audio_file=file_path
        )
        db.add(new_album)
        db.commit()
        db.refresh(new_album)

        # Return album info
        return {
            "Album_id": new_album.Album_id,
            "Album_title": new_album.Album_title,
            "Total_tracks": new_album.Total_tracks,
            "audio_url": f"/static/{audio.filename}" if audio else None
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- PUT Endpoint for Album Update ----------------
@app.put("/api/albums/{album_id}")
async def update_album(
    album_id: int,
    Album_title: str = Form(...),
    Total_tracks: int = Form(...),
    audio: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        album = db.query(Album).filter(Album.Album_id == album_id).first()
        if not album:
            raise HTTPException(status_code=404, detail="Album not found")

        # Update fields
        album.Album_title = Album_title
        album.Total_tracks = Total_tracks

        # Update audio file if provided
        if audio:
            # Delete old file if exists
            if album.audio_file and os.path.exists(album.audio_file):
                os.remove(album.audio_file)
            
            # Save new audio file
            file_path = os.path.join(UPLOAD_DIR, audio.filename)
            with open(file_path, "wb") as f:
                shutil.copyfileobj(audio.file, f)
            album.audio_file = file_path

        db.commit()
        db.refresh(album)

        return {
            "Album_id": album.Album_id,
            "Album_title": album.Album_title,
            "Total_tracks": album.Total_tracks,
            "audio_url": f"/static/{os.path.basename(album.audio_file)}" if album.audio_file else None
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- DELETE Endpoint for Album ----------------
@app.delete("/api/albums/{album_id}")
async def delete_album(album_id: int, db: Session = Depends(get_db)):
    try:
        album = db.query(Album).filter(Album.Album_id == album_id).first()
        if not album:
            raise HTTPException(status_code=404, detail="Album not found")

        # Delete audio file if exists
        if album.audio_file and os.path.exists(album.audio_file):
            os.remove(album.audio_file)

        db.delete(album)
        db.commit()

        return {"message": "Album deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- GET Search Albums ----------------
@app.get("/api/albums/search")
async def search_albums(query: str, db: Session = Depends(get_db)):
    try:
        albums = db.query(Album).filter(Album.Album_title.like(f"%{query}%")).all()
        return [
            {
                "Album_id": album.Album_id,
                "Album_title": album.Album_title,
                "Total_tracks": album.Total_tracks,
                "audio_url": f"/static/{os.path.basename(album.audio_file)}" if album.audio_file else None
            }
            for album in albums
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ================ SONG ENDPOINTS ================

# ---------------- GET All Songs ----------------
@app.get("/api/songs/all")
async def get_all_songs(db: Session = Depends(get_db)):
    try:
        songs = db.query(Song).all()
        return [
            {
                "Songs_id": song.Songs_id,
                "Songs_name": song.Songs_name,
                "Gener": song.Gener,
                "audio_url": f"/static/{os.path.basename(song.audio_file)}" if song.audio_file else None
            }
            for song in songs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- POST Endpoint for Song Creation ----------------
@app.post("/api/songs/create")
async def create_song(
    Songs_name: str = Form(...),
    Gener: str = Form(...),
    audio: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        file_path = None
        if audio:
            # Save audio file
            file_path = os.path.join(UPLOAD_DIR, audio.filename)
            with open(file_path, "wb") as f:
                shutil.copyfileobj(audio.file, f)

        # Insert into database
        new_song = Song(
            Songs_name=Songs_name,
            Gener=Gener,
            audio_file=file_path
        )
        db.add(new_song)
        db.commit()
        db.refresh(new_song)

        # Return song info
        return {
            "Songs_id": new_song.Songs_id,
            "Songs_name": new_song.Songs_name,
            "Gener": new_song.Gener,
            "audio_url": f"/static/{audio.filename}" if audio else None
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- PUT Endpoint for Song Update ----------------
@app.put("/api/songs/{song_id}")
async def update_song(
    song_id: int,
    Songs_name: str = Form(...),
    Gener: str = Form(...),
    audio: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        song = db.query(Song).filter(Song.Songs_id == song_id).first()
        if not song:
            raise HTTPException(status_code=404, detail="Song not found")

        # Update fields
        song.Songs_name = Songs_name
        song.Gener = Gener

        # Update audio file if provided
        if audio:
            # Delete old file if exists
            if song.audio_file and os.path.exists(song.audio_file):
                os.remove(song.audio_file)
            
            # Save new audio file
            file_path = os.path.join(UPLOAD_DIR, audio.filename)
            with open(file_path, "wb") as f:
                shutil.copyfileobj(audio.file, f)
            song.audio_file = file_path

        db.commit()
        db.refresh(song)

        return {
            "Songs_id": song.Songs_id,
            "Songs_name": song.Songs_name,
            "Gener": song.Gener,
            "audio_url": f"/static/{os.path.basename(song.audio_file)}" if song.audio_file else None
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- DELETE Endpoint for Song ----------------
@app.delete("/api/songs/{song_id}")
async def delete_song(song_id: int, db: Session = Depends(get_db)):
    try:
        song = db.query(Song).filter(Song.Songs_id == song_id).first()
        if not song:
            raise HTTPException(status_code=404, detail="Song not found")

        # Delete audio file if exists
        if song.audio_file and os.path.exists(song.audio_file):
            os.remove(song.audio_file)

        db.delete(song)
        db.commit()

        return {"message": "Song deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- GET Search Songs ----------------
@app.get("/api/songs/search")
async def search_songs(query: str, db: Session = Depends(get_db)):
    try:
        songs = db.query(Song).filter(Song.Songs_name.like(f"%{query}%")).all()
        return [
            {
                "Songs_id": song.Songs_id,
                "Songs_name": song.Songs_name,
                "Gener": song.Gener,
                "audio_url": f"/static/{os.path.basename(song.audio_file)}" if song.audio_file else None
            }
            for song in songs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
