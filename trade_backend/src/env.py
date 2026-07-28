from fastapi import FastAPI
from fastapi import FastAPI ,Form, UploadFile,File
from typing import Optional
from sqlalchemy.orm import Session

DATABASE_URL = "postgresql://postgres:123123@localhost:5432/Trade"
AtasTradePath = "H:/我的云端硬盘/Trade/综合"

GlobalServerApp:Optional[FastAPI] = None
GlobalDataBaseSession:Optional[Session] = None
