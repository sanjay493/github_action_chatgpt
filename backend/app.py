from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Project

app = FastAPI()

# create tables automatically
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/projects")
def read_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@app.post("/projects")
def add_project(title: str, tech: str, db: Session = Depends(get_db)):
    project = Project(title=title, tech=tech)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project