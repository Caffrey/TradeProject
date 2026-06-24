from fastapi import FastAPI
from fastapi import FastAPI ,Form, UploadFile,File
import pandas as pd
from pathlib import Path
from src.database import TradeImport,DataBaseSession,TradeRecord
from src.env import GlobalEnv

app = FastAPI()

@app.get('/')
async def root():
    return {'message': 'hello world'}



@app.post("/uploadTradeImport")
async def uploadTrade(TradeSheetType : str = Form(...),
                      TradeFile : UploadFile = File(...)):
    df = pd.read_excel(TradeFile.file,sheet_name="Journal")
    TradeImport(df,TradeSheetType)

@app.post('/refreshTradeRecordDataBase')
async def RefreshTradeRecordDataBAse():
    folder = Path(GlobalEnv.AtasTradePath)

    DataBaseSession.query(TradeRecord).delete()
    excel_files = list(folder.glob("*.xlsx"))
    for file in folder.glob("*.xlsx"):
        df = pd.read_excel(file,sheet_name="Journal")
        TradeImport(df,"Atas")
