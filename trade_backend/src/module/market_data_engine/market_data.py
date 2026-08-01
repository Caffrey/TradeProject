from typing import List

from sqlalchemy.orm import declarative_base
import src.env as GlobalEnv 

from sqlalchemy import Column, BigInteger,DateTime, Text,Numeric,UniqueConstraint
from openbb import obb
from pandas import DataFrame
from datetime import date
from src.module.database_module.database_interface import UpsertAll


class DB_CandleData(declarative_base()):
    __tablename__ = 'HistoryCandleData'
    ID = Column(BigInteger, primary_key=True)
    Open = Column(Numeric)
    Close = Column(Numeric)
    High = Column(Numeric)
    Low = Column(Numeric)
    Volume = Column(Numeric)
    Date = Column(DateTime)
    Symbol = Column(Text)
    TimeFrame = Column(Text)
    Market = Column(Text)
    __table_args__ = (
        UniqueConstraint(
            "Symbol",
            "TimeFrame",
            "Date",
            "Market",
            name="uq_market_bar"
        ),
    )



def DataFrameToDbData(df:DataFrame,market,interval):
    df = df.reset_index()
    arr = []
    for index, row in df.iterrows():
        candle = DB_CandleData()
        candle.Symbol = row['symbol']
        candle.Open = row['open']
        candle.Close = row['close']
        candle.High = row['high']   
        candle.Low = row['low']
        candle.Volume = row['volume']
        candle.TimeFrame = interval
        candle.Date = row['date']
        candle.Market = market
        arr.append(candle)
    return arr



#自动从开始日期，补全到今天
def DownHistoryDateToDataBase(market:str, Symbol:List[str], interval:str, startDate:date, endDate:date):

    data = None
    if market == "stock":
        data = obb.equity.price.historical(symbol=Symbol,
                                           interval=interval, start_date=startDate,end_date=endDate)
    elif market == "future":
        data = obb.derivatives.futures.historical(symbol=Symbol,
                                           interval=interval, start_date=startDate,end_date=endDate)
    elif market == "froex":
        data = obb.currency.price.historical(symbol=Symbol,
                                           interval=interval, start_date=startDate,end_date=endDate)
    AddDataFrameToDataBase(data,market,interval)




def AddDataFrameToDataBase(data,market:str, interval:str):
    arr = DataFrameToDbData(data.to_dataframe(), market=market,interval=interval)
    UpsertAll(GlobalEnv.GlobalDataBaseSession,DB_CandleData,arr)
    

