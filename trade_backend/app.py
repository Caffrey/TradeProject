from fastapi import FastAPI
from fastapi import FastAPI ,Form, UploadFile,File
import pandas as pd
from pathlib import Path
from src import database

app = FastAPI()

@app.get('/')
async def root():
    return {'message': 'hello world'}



@app.post("/uploadTradeImport")
async def uploadTrade(TradeSheetType : str = Form(...),
                      TradeFile : UploadFile = File(...)):
    df = pd.read_excel(TradeFile.file,sheet_name="Journal")
    database.TradeImport(df,TradeSheetType)

@app.post('/refreshTradeRecordDataBase')
async def RefreshTradeRecordDataBAse():
    folder = Path("I:/我的云端硬盘/Trade/综合")
    excel_files = list(folder.glob("*.xlsx"))
    for file in folder.glob("*.xlsx"):
        print("--------------------")
        print(file)
        df = pd.read_excel(file,sheet_name="Journal")
        database.TradeImport(df,"Atas")
