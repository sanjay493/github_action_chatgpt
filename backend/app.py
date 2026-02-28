from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine, Base
from models import Project, Profile

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
class ProjectCreate(BaseModel):
    title: str
    tech: str

# ---------- DB SESSION ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- SEED DATA ----------
@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    if not db.query(Profile).first():
        profile = Profile(
            name="Sanjay Kumar",
            role="Full Stack Developer",
            bio="Passionate about building scalable web applications and exploring new technologies.",
            email="sanjay@example.com",
            github="https://github.com/sanjay493",
            linkedin="https://linkedin.com/in/sanjay493"
        )
        db.add(profile)
        db.commit()
    db.close()

# ---------- PROJECT ROUTES ----------
@app.get("/projects")
def read_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@app.post("/projects")
def add_project(project_data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(title=project_data.title, tech=project_data.tech)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

# ---------- PROFILE ROUTE ----------
@app.get("/profile")
def read_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile