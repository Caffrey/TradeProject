from fastapi import APIRouter
from src.module.trade_module.server_trade import *
from src.module.trade_module import trade_module_config as TradeModuleConfig 



Trade_Router = APIRouter()

@Trade_Router.get('/')
async def root():
    return {'message': 'hello world'}

@Trade_Router.post('/rest_trade/RefreshTradeRecordDataBase')
async def RefreshTradeRecordDataBAse(RecordType:str):
    Trade_Refresh()

@Trade_Router.get('/rest_trade/GetFilterData')
async def GetTradeFliterData():
    result =  GetHistoryTradeFliterData()
    return result


@Trade_Router.get('/rest_trade/GetTradeData')
async def GetTradeData(
    StartDate : datetime,
    EndDate : datetime,
    Platfotm:str,
    Account:str,
    Strategy:str,
    SymbolName : str,
    ):
    print('kla;sjdlkasjdlkjsakdj')
    trades = Trade_GetTrades(StartDate,EndDate,Platfotm,Account,Strategy,SymbolName)
    return trades
