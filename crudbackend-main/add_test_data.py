#!/usr/bin/env python3
"""Script to add test data to the database"""
from database import SessionLocal, engine, Base
from models import Album, Song

# Create tables
Base.metadata.create_all(bind=engine)

# Create test data
db = SessionLocal()
try:
    # Clear existing data
    db.query(Song).delete()
    db.query(Album).delete()
    db.commit()
    
    # Add test albums
    albums = [
        Album(Album_title='Greatest Hits', Total_tracks=15, audio_file=None),
        Album(Album_title='Summer Vibes', Total_tracks=20, audio_file=None),
        Album(Album_title='Classic Collection', Total_tracks=12, audio_file=None),
    ]
    for album in albums:
        db.add(album)
    
    # Add test songs
    songs = [
        Song(Songs_name='Bohemian Rhapsody', Gener='Rock', audio_file=None),
        Song(Songs_name='Blinding Lights', Gener='Pop', audio_file=None),
        Song(Songs_name='Hotel California', Gener='Rock', audio_file=None),
        Song(Songs_name='Shape of You', Gener='Pop', audio_file=None),
        Song(Songs_name='Stairway to Heaven', Gener='Rock', audio_file=None),
    ]
    for song in songs:
        db.add(song)
    
    db.commit()
    print('✅ Test data added successfully!')
    print(f'   Albums: {len(albums)}')
    print(f'   Songs: {len(songs)}')
except Exception as e:
    db.rollback()
    print(f'❌ Error: {e}')
    import traceback
    traceback.print_exc()
finally:
    db.close()

