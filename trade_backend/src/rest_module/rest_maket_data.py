from fastapi import APIRouter
from src.module.market_data_engine.market_data import *
from src.module.market_data_engine.market_data_auto_update import MakeUpdatePackges,LoadConfig,MarketDataConfig,AutoUpdate
import src.env as GlobalEnv 
from datetime import timedelta



MarketDataRoute = APIRouter()


@MarketDataRoute.get('/market_data/GetValidSymbol')
async def GetTradeData(market:str):
    result = GlobalEnv.GlobalDataBaseSession.query(DB_CandleData.Symbol).filter(DB_CandleData.Market == market).distinct().all()
    print(GlobalEnv.QueryToJson(result))
    return GlobalEnv.QueryToJson(result)

@MarketDataRoute.get('/market_data/HistoryData')
async def GetTradeData(market:str, symbol:str):
    print(market+"---"+symbol)
    result = GlobalEnv.GlobalDataBaseSession.query(DB_CandleData).filter(DB_CandleData.Market == market, DB_CandleData.Symbol == symbol,DB_CandleData.TimeFrame=="1h").distinct().order_by(DB_CandleData.Date.asc()).all()
    print(GlobalEnv.QueryToJson(result))
    return GlobalEnv.QueryToJson(result)

@MarketDataRoute.get('/market_data/RefreshFuture')
async def GetTradeData():
    marketConfig:MarketDataConfig = LoadConfig()
    startDate = date(2026,7,1)
    endDate = date.today()-timedelta(days=1)
    print(endDate)
    package = MakeUpdatePackges(marketConfig.future,startDate,endDate)
    await AutoUpdate(package,10)
    
