from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Query
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload, Session
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List, Optional

# 절대 import로 변경
from src.models import Base, Regulation, Article
from src.schemas import RegulationResponse, ArticleResponse
from src.routers import regulations, articles

app = FastAPI()


app.include_router(articles.router)
app.include_router(regulations.router)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Korean Regulation Uploader API"}
