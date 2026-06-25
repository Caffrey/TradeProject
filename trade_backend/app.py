from fastapi import FastAPI
from fastapi import FastAPI ,Form, UploadFile,File
import pandas as pd
from pathlib import Path
from src.database import TradeImport,DataBaseSession,TradeRecord,GetTrades
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


@app.get('/GetTradeData')
async def GetTradeData(
    StartDate : str,
    EndDate : str,
    Symbol : str):
    trades = GetTrades(StartDate,EndDate,Symbol)

    result = {}
    result.StartDate = StartDate;
    result.EndDate = EndDate;
    result.Symbol = Symbol;

    result.EquityCurve = []
    result.Distriton = []

    id = 0
    sum = 0
    for PerTrade in trades:
        id = id + 1
        sum = sum + PerTrade.Pnl
        result.EquityCurve.append({"header":id,"value":sum})

    

