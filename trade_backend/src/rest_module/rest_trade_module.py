from fastapi import APIRouter
from src.trade_module.meta_trade_module import *
from src.trade_module.server_trade import *
#api

Trade_Router = APIRouter()

@Trade_Router.get('/')
async def root():
    return {'message': 'hello world'}

@Trade_Router.post('/refreshTradeRecordDataBase')
async def RefreshTradeRecordDataBAse(RecordType:str):
    if RecordType == "Atas":
        Trade_RefreshAtasDataBase()
    elif RecordType == "MT5":
        Trade_RefreshMT5()


@Trade_Router.get('/GetTradeData')
async def GetTradeData(
    StartDate : datetime,
    EndDate : datetime,
    SymbolName : str):

    trades = Trade_GetTrades(StartDate,EndDate,SymbolName)

    return trades

