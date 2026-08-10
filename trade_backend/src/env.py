from fastapi import FastAPI
from fastapi import FastAPI ,Form, UploadFile,File
from typing import Optional
from sqlalchemy.orm import Session
from pathlib import Path


DATABASE_URL = "postgresql://postgres:123123@localhost:5432/Trade"

TradeRecordsPath = "G:/我的云端硬盘/Trade/TradeRecord"



AtasTradePath = "G:/我的云端硬盘/Trade/综合"
ExnessTradePath = "G:/我的云端硬盘/Trade/Exness/TradeHistory.csv"

GlobalServerApp:Optional[FastAPI] = None
GlobalDataBaseSession:Optional[Session] = None

BASE_DIR = Path(__file__).resolve().parent.parent



from fastapi.encoders import jsonable_encoder
def QueryToJson(query_result):
    return jsonable_encoder([
        dict(row._mapping)
        if hasattr(row, "_mapping")
        else row
        for row in query_result
    ])