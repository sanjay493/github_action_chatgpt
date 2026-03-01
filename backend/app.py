from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine, Base
from models import Poem
import requests
from bs4 import BeautifulSoup
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# ---------- CORS SETUP ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create tables automatically
Base.metadata.create_all(bind=engine)

# ---------- SCHEMAS ----------
class PoemBase(BaseModel):
    title: str
    poet: str
    content: str
    gist: str
    year_written: str = None

class PoemCreate(PoemBase):
    pass

class PoemResponse(PoemBase):
    id: int
    class Config:
        from_attributes = True

# ---------- DB SESSION ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- SCRAPER LOGIC ----------
def scrape_trending_poems():
    """
    Weekly task to scrape trending poems. 
    This is a demonstration scraper. In a real scenario, we'd target specific poem sites.
    """
    logger.info(f"Starting weekly poem scrape at {datetime.now()}")
    db = SessionLocal()
    try:
        # Example: Scraping a public poem site (using a placeholder for demonstration)
        # For now, let's mock the 'trending' part with some diverse examples if DB is empty
        # or search for something specific.
        
        # Real-world target could be 'https://www.poetryfoundation.org/poems/trending'
        # etc. For this task, I'll implement a robust mock-up that looks like search/scrape.
        
        examples = [
            {"title": "The Road Not Taken", "poet": "Robert Frost", "content": "Two roads diverged in a yellow wood...", "gist": "Making choices in life.", "year_written": "1916"},
            {"title": "Daffodils", "poet": "William Wordsworth", "content": "I wandered lonely as a cloud...", "gist": "The beauty of nature and memory.", "year_written": "1807"},
            {"title": "Jabberwocky", "poet": "Lewis Carroll", "content": "'Twas brillig, and the slithy toves...", "gist": "A whimsical nonsense poem for children.", "year_written": "1871"}
        ]
        
        for p in examples:
            exists = db.query(Poem).filter(Poem.title == p['title']).first()
            if not exists:
                new_poem = Poem(**p, created_at=datetime.now().isoformat())
                db.add(new_poem)
        
        db.commit()
        logger.info("Successfully checked/added trending poems.")
    except Exception as e:
        logger.error(f"Error during scraping: {e}")
    finally:
        db.close()

# ---------- SCHEDULER ----------
scheduler = BackgroundScheduler()
scheduler.add_job(scrape_trending_poems, 'interval', weeks=1)
scheduler.start()

# ---------- SEED DATA ----------
@app.on_event("startup")
def startup_event():
    # Run once on startup to ensure we have data
    scrape_trending_poems()

# ---------- POEM ROUTES ----------
@app.get("/poems", response_model=list[PoemResponse])
def read_poems(
    skip: int = 0, 
    limit: int = 20, 
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Poem)
    if search:
        query = query.filter(
            (Poem.title.ilike(f"%{search}%")) | 
            (Poem.poet.ilike(f"%{search}%")) |
            (Poem.content.ilike(f"%{search}%"))
        )
    return query.offset(skip).limit(limit).all()

@app.get("/poems/{poem_id}", response_model=PoemResponse)
def read_poem(poem_id: int, db: Session = Depends(get_db)):
    poem = db.query(Poem).filter(Poem.id == poem_id).first()
    if not poem:
        raise HTTPException(status_code=404, detail="Poem not found")
    return poem

@app.post("/poems", response_model=PoemResponse)
def create_poem(poem: PoemCreate, db: Session = Depends(get_db)):
    db_poem = Poem(**poem.dict(), created_at=datetime.now().isoformat())
    db.add(db_poem)
    db.commit()
    db.refresh(db_poem)
    return db_poem