from typing import TypedDict
import json
from src import env as GlobalEnv
from pathlib import Path
from .market_data import DB_CandleData
from pandas import DataFrame
import pandas as pd 
from sqlalchemy import delete

class DataId(TypedDict):
    source: str
    symbol: str
    period: int


class MarketData(TypedDict):
    ver: int
    dataId: DataId

    terminal: str
    company: str
    server: str

    symbol: str
    description: str
    period: int

    baseCurrency: str
    priceIn: str

    lotSize: int
    stopLevel: int
    minLot: float
    maxLot: int
    lotStep: float

    spread: int
    digits: int
    bars: int

    swapLong: int
    swapShort: int
    swapThreeDays: int
    swapType: int
    swapMode: int

    commissionType: int
    commission: int

    pointValue: int
    point: float
    pip: float

    time: list[int]
    open: list[float]
    high: list[float]
    low: list[float]
    close: list[float]

    volume: list[int]
    spreads: list[int]

    meta: list

import pandas as pd
from pathlib import Path
from sqlalchemy import insert


def RefreshFroexMarketData():
    print("refresh froex start")

    session = GlobalEnv.GlobalDataBaseSession
    folder = Path(GlobalEnv.FroexMarketData)

    GlobalEnv.GlobalDataBaseSession.execute(delete(DB_CandleData))
    GlobalEnv.GlobalDataBaseSession.commit()

    for file in folder.glob("*.csv"):

        print(f"processing: {file.name}")

        # 直接读取 + 指定列
        df = pd.read_csv(
            file,
            header=None,
            names=[
                "Date",
                "Open",
                "High",
                "Low",
                "Close",
                "Volume"
            ],
            parse_dates=["Date"]
        )

        # xxx_M30.csv
        name_arr = file.stem.split("_")

        symbol = name_arr[0]
        timeFrame = name_arr[1]

        # Pandas 批量转换
        records = df.to_dict("records")

        # 添加固定字段
        for record in records:
            record["Symbol"] = symbol
            record["SourceSymbol"] = symbol
            record["TimeFrame"] = timeFrame
            record["Market"] = "Froex"

        # 批量 INSERT
        session.execute(
            insert(DB_CandleData),
            records
        )

        session.commit()

        print(f"complete: {file.name}, rows={len(records)}")

    print("refresh froex data complete")