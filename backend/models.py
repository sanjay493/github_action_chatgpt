from sqlalchemy import Column, Integer, String, Text
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    tech = Column(String)

class Profile(Base):
    __tablename__ = "profile"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    bio = Column(Text)
    email = Column(String)
    github = Column(String)
    linkedin = Column(String)