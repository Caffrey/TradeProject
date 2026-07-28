from fastapi import FastAPI
from fastapi import FastAPI ,Form, UploadFile,File
import pandas as pd
from src.dataBase import TradeImport,DataBaseSession,TradeRecord,GetTrades,RefreshAtasDataBase
from datetime import datetime


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
    RefreshAtasDataBase()

@app.get('/GetTradeData')
async def GetTradeData(
    StartDate : datetime,
    EndDate : datetime,
    SymbolName : str):

    print(StartDate)
    print(EndDate)

    trades = GetTrades(StartDate,EndDate,SymbolName)

    sum = 0
    for trade in trades :
        sum  =sum + trade.Pnl
        trade.TotalPnl = sum 

    return trades

    # result = {}
    # result.StartDate = StartDate;
    # result.EndDate = EndDate;
    # result.Symbol = Symbol;

    # result.EquityCurve = []
    # result.Distriton = []

    # id = 0
    # sum = 0
    # for PerTrade in trades:
    #     id = id + 1
    #     sum = sum + PerTrade.Pnl
    #     result.EquityCurve.append({"header":id,"value":sum})

    

