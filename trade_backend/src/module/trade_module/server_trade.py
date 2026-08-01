
import re
from datetime import datetime
from pathlib import Path
from pandas import DataFrame
import pandas as pd

from src import env as GlobalEnv
from .meta_trade import ExpotallMetaTradeHistory
from .trade_data import *
from .meta_trade import *
from .atas_trade import *
from . import trade_module_config as TradeModuleConfig


def Trade_TradeImport(df : DataFrame, TradeSheetType : str ):
    match TradeSheetType:
        case TradeModuleConfig.RECORD_TYPE_ATAS :
            Trade_ProcessAtasDataFrame(df)
        case TradeModuleConfig.RECORD_TYPE_MT5:
            Trade_ProcessMT5DataFrame(df)

def Trade_RefreshAtasDataBase():
    Trade_ClearTable(TradeModuleConfig.RECORD_TYPE_ATAS)
    folder = Path(GlobalEnv.AtasTradePath)
    for file in folder.glob("*.xlsx"):
        df = pd.read_excel(file,sheet_name="Journal")
        Trade_TradeImport(df,TradeModuleConfig.RECORD_TYPE_ATAS)


def Trade_RefreshMT5():
    Trade_ClearTable(TradeModuleConfig.RECORD_TYPE_MT5)
    ExpotallMetaTradeHistory()
    df = pd.read_csv(GlobalEnv.ExnessTradePath)
    Trade_TradeImport(df,TradeModuleConfig.RECORD_TYPE_MT5)


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

def Trade_ClearTable(RecordType:str):
    GlobalEnv.GlobalDataBaseSession.query(TradeRecord).filter(TradeRecord.TradeRecordType == RecordType).delete()
    GlobalEnv.GlobalDataBaseSession.commit()


def GetValidSymbols():
    result = GlobalEnv.GlobalDataBaseSession.query(TradeRecord.Symbol).distinct().all()
    return GlobalEnv.QueryToJson(result)
##清理