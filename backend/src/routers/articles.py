# backend/src/routers/articles.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from src.schemas import RegulationResponse, ArticleResponse
from src.database import get_db
from src.models import Regulation, Article

router = APIRouter(prefix="/articles", tags=["articles"])

@router.get("/search", response_model=List[ArticleResponse])
def search_articles(
    q: Optional[str] = Query(None, min_length=1),
    db: Session = Depends(get_db)
):
    if not q:
        articles = db.query(Article).all()
    else:
        pattern = f"%{q}%"
        articles = db.query(Article).filter(
            (Article.title.ilike(pattern)) |
            (Article.content.ilike(pattern))
        ).all()

    return [
        ArticleResponse(
            id=a.id,
            title=a.title,
            content=a.content,
            source_filename=a.regulation.source_filename if a.regulation else None
        )
        for a in articles
    ]


@router.get("/", response_model=List[ArticleResponse])
def get_all_articles(db: Session = Depends(get_db)):
    articles = db.query(Article).options(joinedload(Article.regulation)).all()
    return [
        ArticleResponse(
            id=a.id,
            title=a.title,
            content=a.content,
            source_filename=a.regulation.source_filename if a.regulation else None
        )
        for a in articles
    ]


@router.get("/{article_id}", response_model=ArticleResponse)
def get_article_by_id(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).options(joinedload(Article.regulation)).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return ArticleResponse(
        id=article.id,
        title=article.title,
        content=article.content,
        source_filename=article.regulation.source_filename if article.regulation else None
    )
