from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

class Regulation(Base):
    __tablename__ = "regulations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    establishment_date = Column(DateTime)
    revision_date = Column(DateTime)
    department = Column(String)
    manager = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    articles = relationship("Article", back_populates="regulation")

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    regulation_id = Column(Integer, ForeignKey("regulations.id"))

    regulation = relationship("Regulation", back_populates="articles")
