from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from src.market_data_engine.market_data import *
import src.env as GlobalEnv 


MarketDataRoute = APIRouter()

def QueryToJson(query_result):
    return jsonable_encoder([
        dict(row._mapping)
        if hasattr(row, "_mapping")
        else row
        for row in query_result
    ])

@MarketDataRoute.get('/market_data/GetValidSymbol')
async def GetTradeData(market:str):
    result = GlobalEnv.GlobalDataBaseSession.query(DB_CandleData.Symbol).filter(DB_CandleData.Market == market).distinct().all()
    return QueryToJson(result)

@MarketDataRoute.get('/market_data/HistoryData')
async def GetTradeData(market:str, symbol:str):
    result = GlobalEnv.GlobalDataBaseSession.query(DB_CandleData).filter(DB_CandleData.Market == market, DB_CandleData.Symbol == symbol).distinct().all()
    return QueryToJson(result)