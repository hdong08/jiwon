from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Query
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import io,docx,re,os
from fastapi.middleware.cors import CORSMiddleware
# Database Configuration (PostgreSQL)
DATABASE_URL = os.getenv("DATABASE_URL") 
engine = create_engine(DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the Article model
class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    source_filename = Column(String, nullable=True)

# Pydantic model for response
class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str
    source_filename: str | None

    class Config:
        orm_mode = True

# Create database tables (Alembic can comment out or remove this part)
# Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",  # Vite 기본 개발 서버 주소

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # 허용할 출처 리스트
    allow_credentials=True,
    allow_methods=["*"],         # 모든 HTTP 메서드 허용
    allow_headers=["*"],         # 모든 헤더 허용
)

# Database session dependency injection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/upload-regulation/")
async def upload_regulation(file: UploadFile = File(...)):
    contents = await file.read()
    doc = docx.Document(io.BytesIO(contents))
    
    articles = []
    current_article_title = None
    current_article_content = []
    
    article_title_pattern = re.compile(r"^제\s*\d+\s*조")

    for paragraph in doc.paragraphs:
        text = paragraph.text.strip()
        match = article_title_pattern.match(text)
        if match:
            if current_article_title:
                articles.append({
                    "title": current_article_title,
                    "content": "\n".join(current_article_content)
                })
            current_article_title = match.group()
            remaining_text = text[match.end():].strip()
            current_article_content = []
            if remaining_text:
                current_article_content.append(remaining_text)
        elif current_article_title:
            current_article_content.append(text)
    
    if current_article_title:
        articles.append({
            "title": current_article_title,
            "content": "\n".join(current_article_content)
        })

    db = SessionLocal()
    try:
        for article_data in articles:
            db_article = Article(
                title=article_data["title"],
                content=article_data["content"],
                source_filename=file.filename
            )
            db.add(db_article)
        db.commit()
    finally:
        db.close()

    return {"message": "Regulation uploaded and parsed successfully!", "articles_count": len(articles)}

@app.get("/articles/search", response_model=List[ArticleResponse])
def search_articles(
    q: Optional[str] = Query(None, min_length=1, description="Search keyword for title or content"),
    db: Session = Depends(get_db)
):
    if not q:
        return db.query(Article).all()

    search_pattern = f"%{q}%"
    articles = db.query(Article).filter(
        (Article.title.ilike(search_pattern)) |
        (Article.content.ilike(search_pattern))
    ).all()
    return articles

@app.get("/articles/", response_model=List[ArticleResponse])
async def get_all_articles(db: Session = Depends(get_db)): # Add db dependency
    try:
        articles = db.query(Article).all()
        return articles
    finally:
        db.close()

@app.get("/articles/{article_id}", response_model=ArticleResponse)
async def get_article_by_id(article_id: int, db: Session = Depends(get_db)): # Add db dependency
    try:
        article = db.query(Article).filter(Article.id == article_id).first()
        if article is None:
            raise HTTPException(status_code=404, detail="Article not found")
        return article
    finally:
        db.close()

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Korean Regulation Uploader API"}
