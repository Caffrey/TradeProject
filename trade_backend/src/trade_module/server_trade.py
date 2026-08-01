
import re
from datetime import datetime
from pathlib import Path

from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, BigInteger, Text,DateTime,Numeric
from sqlalchemy.orm import Session
from pandas import DataFrame
import pandas as pd

from .. import env as GlobalEnv
from .meta_trade_module import ExpotallMetaTradeHistory


class User(declarative_base()):
    __tablename__ = 'User'

    ID = Column(BigInteger, primary_key=True)
    UserName = Column(Text)
    Password = Column(Text)

class TradeRecord(declarative_base()):
    __tablename__= "TradeRecord"
    ID = Column(BigInteger,primary_key=True,autoincrement=True)
    Symbol = Column(Text)
    OpenTime = Column(DateTime(timezone=False))
    CloseTime = Column(DateTime(timezone=False))
    Lot = Column(BigInteger)
    Tick = Column(BigInteger)
    Pnl = Column(Numeric)
    SourceSymbol = Column(Text)
    Acount = Column(Text)
    TradeRecordType = Column(Text)



def Trade_FilterSymbolName(Name:str):
    code = Name

    match = re.search(
            r'#?([A-Z]{1,3})(?=[FGHJKMNQUVXZ]\d|$)',
            code
        )

    if not match:
        raise ValueError(f"非法代码: {code}")

    return match.group(1)


def Trade_ProcessMT5DataFrame(df : DataFrame):
    arr = []
    for index, row in df.iterrows():
        trade = TradeRecord()
        trade.Symbol =  row['symbol']
        trade.SourceSymbol = row['symbol']
        trade.OpenTime = row['entry_time']
        trade.Lot = row['volume']
        trade.CloseTime = row['exit_time']
        trade.Tick = row['profit']
        trade.Pnl = row['profit']
        arr.append(trade)
    GlobalEnv.GlobalDataBaseSession.add_all(arr)
    GlobalEnv.GlobalDataBaseSession.commit()

def Trade_ProcessAtasDataFrame(df : DataFrame):
    arr = []
    for index, row in df.iterrows():
        trade = TradeRecord()
        trade.Symbol =  Trade_FilterSymbolName(row['Instrument'])
        trade.SourceSymbol = row['Instrument']
        trade.OpenTime = row['Open time']
        trade.Lot = row['Open volume']
        trade.CloseTime = row['Close time'] if pd.notna(row['Close time']) else row["Open time"]
        trade.Tick = row['Profit (ticks)']
        trade.Pnl = row['PnL']
        arr.append(trade)
    GlobalEnv.GlobalDataBaseSession.add_all(arr)
    GlobalEnv.GlobalDataBaseSession.commit()



def Trade_TradeImport(df : DataFrame, TradeSheetType : str ):
    match TradeSheetType:
        case "Atas" :
            Trade_ProcessAtasDataFrame(df)
        case "MT5":
            Trade_ProcessMT5DataFrame(df)

def Trade_RefreshAtasDataBase():
    folder = Path(GlobalEnv.AtasTradePath)
    for file in folder.glob("*.xlsx"):
        df = pd.read_excel(file,sheet_name="Journal")
        Trade_TradeImport(df,"Atas")


def Trade_RefreshMT5():
    ExpotallMetaTradeHistory()
    df = pd.read_csv(GlobalEnv.ExnessTradePath)
    Trade_TradeImport(df,"MT5")



def Trade_GetTrades(
    StartDate : datetime,
    EndDate : datetime,
    Symbol : str):
    selectResult = GlobalEnv.GlobalDataBaseSession.query(TradeRecord).where(
        TradeRecord.Symbol.contains(Symbol),
        TradeRecord.CloseTime <= EndDate,
        TradeRecord.OpenTime >= StartDate
    )
    trades = selectResult.all()
    return trades;

def Trade_ClearTable():
    GlobalEnv.GlobalDataBaseSession.query(TradeRecord).delete()
    GlobalEnv.GlobalDataBaseSession.commit()

