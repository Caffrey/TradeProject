import os
import re
from datetime import datetime
from pathlib import Path
from pandas import DataFrame
import pandas as pd

from src import env as GlobalEnv
from .meta_trade import ExpotallMetaTradeHistory
from sqlalchemy import delete
from .trade_data import *
from .meta_trade import *
from .atas_trade import *
from . import trade_module_config as TradeModuleConfig


def Trade_TradeImport(df : DataFrame, TradeSheetType : str ,acount:str,method:str):
    arr = None
    print(TradeSheetType,acount,method)
    match TradeSheetType:
        case TradeModuleConfig.RECORD_TYPE_ATAS :
            arr = Trade_ProcessAtasDataFrame(df)
        case TradeModuleConfig.RECORD_TYPE_MT5:
            arr = Trade_ProcessMT5DataFrame(df)

    if not(arr == None):
        for item in arr:
            item.TradeRecordType = TradeSheetType
            item.Acount = acount
            item.Strategy = method
        
        GlobalEnv.GlobalDataBaseSession.add_all(arr)
        GlobalEnv.GlobalDataBaseSession.commit()


def Trade_RefreshAtasDataBase(acount:str,method:str,path:str):
    folder = Path(path)
    for file in folder.glob("*.xlsx"):
        df = pd.read_excel(file,sheet_name="Journal")
        Trade_TradeImport(df,TradeModuleConfig.RECORD_TYPE_ATAS,acount,method)

def Trade_RefreshMT5(acount:str,method:str,path:str):
    folder = Path(path)
    for file in folder.glob("*.csv"):
        df = pd.read_csv(file)
        Trade_TradeImport(df,TradeModuleConfig.RECORD_TYPE_MT5,acount,method)
    
def Trade_Refresh():
    GlobalEnv.GlobalDataBaseSession.execute(delete(TradeRecord))
    GlobalEnv.GlobalDataBaseSession.commit()
    for folderName in os.listdir(GlobalEnv.TradeRecordsPath):
        platform,acount,method = folderName.split("_")
        Trade_AnalaysisImport(platform,acount,method, os.path.join(GlobalEnv.TradeRecordsPath,folderName))


def Trade_AnalaysisImport(platform,acount,method,path):
    print(platform,acount,method,path)
    match platform:
        case TradeModuleConfig.RECORD_TYPE_ATAS :
            Trade_RefreshAtasDataBase(acount,method,path)
        case TradeModuleConfig.RECORD_TYPE_MT5:
            Trade_RefreshMT5(acount,method,path)

def Trade_GetCommisionData(AcountName:str):
    print(AcountName)
    selectResult = GlobalEnv.GlobalDataBaseSession.query(TradeFee).where(TradeFee.Account == AcountName)

    resultMap:dict = {}
    for x in selectResult:
        resultMap[x.Symbol] = x.Fee

    
    return resultMap


def Trade_GetTrades(
    StartDate : datetime,
    EndDate : datetime,
    Platfotm:str,
    AcountName:str,
    Strategy:str,
    Symbol : str):
    selectResult = GlobalEnv.GlobalDataBaseSession.query(TradeRecord).where(
        TradeRecord.Symbol.contains(Symbol),
        TradeRecord.Acount.contains(AcountName),
        TradeRecord.Strategy.contains(Strategy),
        TradeRecord.TradeRecordType.contains(Platfotm),
        TradeRecord.CloseTime <= EndDate,
        TradeRecord.OpenTime >= StartDate
    )
    trades = selectResult.all()

    #process commissions
    commissions:dict= Trade_GetCommisionData(AcountName)    

    for x in trades:
        feeResult = commissions.get(x.Symbol)
        if feeResult == None:
            x.Fee = 0
        else:
            x.Fee = feeResult


    return trades;

def Trade_ClearTable(RecordType:str):
    GlobalEnv.GlobalDataBaseSession.query(TradeRecord).filter(TradeRecord.TradeRecordType == RecordType,).delete()
    GlobalEnv.GlobalDataBaseSession.commit()


def GetHistoryTradeFliterData():
    result = GlobalEnv.GlobalDataBaseSession.query(TradeRecord.Symbol,TradeRecord.Acount,TradeRecord.TradeRecordType,TradeRecord.Strategy).distinct().all()
    return GlobalEnv.QueryToJson(result)
##清理