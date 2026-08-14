from typing import List

from sqlalchemy.orm import declarative_base,Query
from sqlalchemy import func, extract,case, text,Float
from decimal import Decimal
import src.env as GlobalEnv 

from sqlalchemy import Column, BigInteger,DateTime, Text,Numeric,UniqueConstraint
from openbb import obb
from pandas import DataFrame
from datetime import date,datetime
from zoneinfo import ZoneInfo
from src.module.database_module.database_interface import UpsertAll
from src.module.common_module import common_function as CommonFunction


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
    SourceSymbol = Column(Text)
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

def convert_newyork_to_utc(dt):
    """
    将纽约时间转换为 UTC 时间
    
    参数:
        dt:
            datetime对象 或 字符串
            
    返回:
        UTC timezone datetime
    """

    ny_timezone = ZoneInfo("America/New_York")
    utc_timezone = ZoneInfo("UTC")


    # 字符串处理
    if isinstance(dt, str):

        # 支持:
        # 2026-08-05 09:30:00
        # 2026-08-05T09:30:00

        dt = dt.replace("T", " ")

        dt = datetime.strptime(
            dt,
            "%Y-%m-%d %H:%M:%S"
        )


    # 没有timezone，认为是纽约时间
    if dt.tzinfo is None:
        dt = dt.replace(
            tzinfo=ny_timezone
        )


    # 转UTC
    return dt.astimezone(
        utc_timezone
    )



def DataFrameToDbData(df:DataFrame,market,interval):
    df = df.reset_index()
    arr = []
    for index, row in df.iterrows():
        candle = DB_CandleData()
        candle.Symbol = CommonFunction.OpenbbSymbolTranslateProcess(row['symbol'])
        candle.Symbol = row['symbol']
        candle.Open = row['open']
        candle.Close = row['close']
        candle.High = row['high']   
        candle.Low = row['low']
        candle.Volume = row['volume']
        candle.TimeFrame = interval
        candle.Date = convert_newyork_to_utc(row['date'])
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
    print(data)
    arr = DataFrameToDbData(data.to_dataframe(), market=market,interval=interval)
    UpsertAll(GlobalEnv.GlobalDataBaseSession,DB_CandleData,arr)


def GetValidSymbol(market:str):
    result = GlobalEnv.GlobalDataBaseSession.query(DB_CandleData.Symbol).filter(DB_CandleData.Market==market) .distinct().all()
    return result

def GetValidTimeFrame(market:str,symbol:str):
    result = GlobalEnv.GlobalDataBaseSession.query(DB_CandleData.TimeFrame).filter(DB_CandleData.Market==market,DB_CandleData.Symbol==symbol).distinct().all()
    return result


def GetIntradayHourData(query:Query):
    local_date = DB_CandleData.Date + text("INTERVAL '8 hours'")
    hour = extract("hour",local_date)

    result = (
            query.with_entities(
                hour.label("Hour"),
                func.avg(DB_CandleData.High-DB_CandleData.Low).label("Volatility"),
                func.stddev_samp(DB_CandleData.High-DB_CandleData.Low).label("Dev")
            )
            .group_by(hour)
            .order_by(hour)
            .all()
        )
    return GlobalEnv.QueryToJson(result)

def GetIntradayHourDisributionWithBearBull(query:Query, targetHour:Numeric,binCount:Numeric,IsBull:bool,BodyVolaiity:bool):
    local_date = DB_CandleData.Date + text("INTERVAL '8 hours'")
    hour = extract("hour",local_date)

    Volatility =  func.abs(DB_CandleData.Open-DB_CandleData.Close) if BodyVolaiity else func.abs(DB_CandleData.High-DB_CandleData.Low)
    filterBull = DB_CandleData.Open < DB_CandleData.Close if IsBull else DB_CandleData.Open > DB_CandleData.Close

    max_volatility = query.with_entities(
        func.max(Volatility)
    ).filter(hour == targetHour).scalar()

    max_volatility = max_volatility * Decimal(1.01)
    bin = func.width_bucket(
        Volatility,
        0,
        max_volatility,
        binCount
    )


    bin_size = max_volatility/binCount
    bin_start = (bin-1)*bin_size
    bin_end = bin  *bin_size

    total_count = func.sum(func.count()).over()
    pob =   (func.count().cast(Float)/total_count)

    result = (
            query.with_entities(
                bin.label("bin"),
                bin_start.label("bin_start"),
                bin_end.label ("bin_end"),
                func.count().label("count"),
                pob.label("proabtility"),
                func.avg(Volatility).label("Volatility"),
                func.stddev_samp(Volatility).label("Dev")
            ).filter(hour == targetHour,filterBull)
            .group_by(bin)
            .order_by(bin)
            .all()
        )
    return GlobalEnv.QueryToJson(result)

def GetIntradayHourDisribution(query:Query, targetHour:Numeric,binCount:Numeric):
    local_date = DB_CandleData.Date + text("INTERVAL '8 hours'")
    hour = extract("hour",local_date)

    Volatility = DB_CandleData.High-DB_CandleData.Low

    max_volatility = query.with_entities(
        func.max(DB_CandleData.High - DB_CandleData.Low)
    ).filter(hour == targetHour).scalar()

    max_volatility = max_volatility * Decimal(1.01)
    bin = func.width_bucket(
        Volatility,
        0,
        max_volatility,
        binCount
    )

    bin_size = max_volatility/binCount
    bin_start = (bin-1)*bin_size
    bin_end = bin  *bin_size

    total_count = func.sum(func.count()).over()
    pob =   (func.count().cast(Float)/total_count)

    result = (
            query.with_entities(
                bin.label("bin"),
                bin_start.label("bin_start"),
                bin_end.label ("bin_end"),
                func.count().label("count"),
                pob.label("proabtility"),
                func.avg(DB_CandleData.High-DB_CandleData.Low).label("Volatility"),
                func.stddev_samp(DB_CandleData.High-DB_CandleData.Low).label("Dev")
            ).filter(hour == targetHour)
            .group_by(bin)
            .order_by(bin)
            .all()
        )
    return GlobalEnv.QueryToJson(result)
                      

def GetMarketDataQuery(market:str, symbol:str,TimeFrame:str, startDate:date,endDate:date):
    result = (
        GlobalEnv.GlobalDataBaseSession
        .query(DB_CandleData.Date,DB_CandleData.Open,DB_CandleData.High,DB_CandleData.Low,DB_CandleData.Close,DB_CandleData.Volume)
        .filter(
            DB_CandleData.Market == market,
            DB_CandleData.Symbol == symbol,
            DB_CandleData.TimeFrame == TimeFrame,
            DB_CandleData.Date >= startDate,
            DB_CandleData.Date < endDate
        )
    )
    return result

