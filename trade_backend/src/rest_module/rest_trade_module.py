from fastapi import APIRouter
from src.module.trade_module.server_trade import *
from src.module.trade_module import trade_module_config as TradeModuleConfig 



Trade_Router = APIRouter()

@Trade_Router.get('/')
async def root():
    return {'message': 'hello world'}

@Trade_Router.post('/rest_trade/RefreshTradeRecordDataBase')
async def RefreshTradeRecordDataBAse(RecordType:str):
    if RecordType == TradeModuleConfig.RECORD_TYPE_ATAS:
        print(RecordType)
        Trade_RefreshAtasDataBase()
    elif RecordType == TradeModuleConfig.RECORD_TYPE_MT5:
        print(RecordType)
    
        Trade_RefreshMT5()

@Trade_Router.get('/rest_trade/GetValidSymbol')
async def GetTradeSymbols():
    return GetValidSymbols()


@Trade_Router.get('/rest_trade/GetTradeData')
async def GetTradeData(
    StartDate : datetime,
    EndDate : datetime,
    SymbolName : str):

    trades = Trade_GetTrades(StartDate,EndDate,SymbolName)

    return trades

