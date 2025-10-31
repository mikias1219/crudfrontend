from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# SQLite database file path
DB_DIR = os.path.dirname(__file__)
DB_FILE = os.path.join(DB_DIR, "music_app.db")
URL_DATABASE = f'sqlite:///{DB_FILE}'

# Create engine for SQLite
engine = create_engine(
    URL_DATABASE,
    connect_args={"check_same_thread": False},  # Needed for SQLite with FastAPI
    echo=True,  # Set to True to see SQL queries (helpful for debugging)
)

# Test connection
try:
    with engine.connect() as conn:
        logger.info(f"✅ SQLite database connection successful! Database file: {DB_FILE}")
except Exception as e:
    logger.error(f"❌ Database connection failed: {e}")

SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine,
    expire_on_commit=False
)

Base = declarative_base()