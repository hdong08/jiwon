from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import docx, io, re


from src.schemas import RegulationResponse, ArticleResponse
from src.database import get_db
from src.models import Regulation, Article


router = APIRouter(
    prefix="/regulations",   # 기본 prefix
    tags=["regulations"]     # 자동 docs 그룹화
)

@router.post("/upload")
async def upload_regulation(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    doc = docx.Document(io.BytesIO(contents))

    # Regulation 먼저 생성 또는 조회 (파일명 기준)
    regulation = db.query(Regulation).filter(Regulation.source_filename == file.filename).first()
    if not regulation:
        regulation = Regulation(source_filename=file.filename)  # ⚠️ name 칼럼 없으면 제거
        db.add(regulation)
        db.commit()
        db.refresh(regulation)

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

    # Article 생성 시 regulation_id로 연결
    for article_data in articles:
        db_article = Article(
            title=article_data["title"],
            content=article_data["content"],
            regulation_id=regulation.id
        )
        db.add(db_article)
    db.commit()

    return {"message": "Regulation uploaded and parsed successfully!", "articles_count": len(articles)}
