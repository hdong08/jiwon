from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base=declarative_base()

class Regulation(Base):
    __tablename__ = "regulations"

    id = Column(Integer, primary_key=True, index=True)
    source_filename = Column(String, index=True)
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
    content = Column(Text)
    regulation_id = Column(Integer, ForeignKey("regulations.id"))

    regulation = relationship("Regulation", back_populates="articles")
