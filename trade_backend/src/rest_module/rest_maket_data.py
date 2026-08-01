from fastapi import APIRouter
from src.module.market_data_engine.market_data import *
import src.env as GlobalEnv 


MarketDataRoute = APIRouter()


@MarketDataRoute.get('/market_data/GetValidSymbol')
async def GetTradeData(market:str):
    result = GlobalEnv.GlobalDataBaseSession.query(DB_CandleData.Symbol).filter(DB_CandleData.Market == market).distinct().all()
    return GlobalEnv.QueryToJson(result)

@MarketDataRoute.get('/market_data/HistoryData')
async def GetTradeData(market:str, symbol:str):
    result = GlobalEnv.GlobalDataBaseSession.query(DB_CandleData).filter(DB_CandleData.Market == market, DB_CandleData.Symbol == symbol).distinct().all()
    return GlobalEnv.QueryToJson(result)