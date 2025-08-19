# Jiwon Regulation 

## 프로젝트 개요
- 한국 법령 및 사규 문서를 업로드하고 조문 단위로 검색/조회 가능한 FastAPI 기반 백엔드 프로젝트
- 프론트엔드: React + TailwindCSS
- 백엔드: Python (FastAPI)
- 데이터베이스: PostgreSQL + SQLAlchemy
- 검색엔진: Elasticsearch(FastAPI 연동 예정)

---

## 개발 및 운영 환경

### 개발 환경
- Frontend: React + Tailwind
- Backend: Python 3.10.11, FastAPI
- ORM: SQLAlchemy
- DB: PostgreSQL
- Search Engine: Elasticsearch(FastAPI)

### API 연동
- 기존 사내 로그인 API 연동
- 국가법령정보 Open API 연동 (API 신청 후 대기 중)

---

## 실행 방법

### Backend
```bash
cd backend
uvicorn src.main:app --reload
