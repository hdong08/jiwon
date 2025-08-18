from pydantic import BaseModel 
from typing import Optional


class RegulationResponse(BaseModel):
    id: int
    source_filename: str

    class Config:
        from_attributes = True

class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str
    source_filename: Optional[str]  # Regulation의 source_filename 참조

    class Config:
        from_attributes = True