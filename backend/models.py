from sqlalchemy import Column, Integer, String, Text
from database import Base

class Poem(Base):
    __tablename__ = "poems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    poet = Column(String, index=True)
    content = Column(Text)
    gist = Column(Text)
    year_written = Column(String, nullable=True)
    created_at = Column(String, nullable=True) # For tracking when it was scraped