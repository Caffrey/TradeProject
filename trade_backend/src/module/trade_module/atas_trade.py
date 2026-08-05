
from src import env as GlobalEnv
from .trade_data import *
import pandas as pd
from pandas import DataFrame
from . import trade_module_config as TradeModuleConfig


def Trade_ProcessAtasDataFrame(df : DataFrame):
    
    print(df.columns)
    #incase none complete records
    if  not ("Close volume" in df.columns):
        return 
    
    arr = []
    for index, row in df.iterrows():

        trade = TradeRecord()
        trade.Symbol =  Trade_FilterSymbolName(row['Instrument'])
        trade.SourceSymbol = row['Instrument']
        trade.OpenTime = row['Open time']
        trade.Lot = row['Open volume']

        trade.OpenVolume = row['Open volume']
        trade.CloseVolume = row['Close volume']
        trade.OpenPrice = row['Open price']
        trade.ClosePrice = row['Close price']

        trade.CloseTime = row['Close time'] if pd.notna(row['Close time']) else row["Open time"]
        trade.Tick = row['Profit (ticks)']
        trade.Pnl = row['PnL']
        trade.TradeRecordType = TradeModuleConfig.RECORD_TYPE_ATAS

        arr.append(trade)
    GlobalEnv.GlobalDataBaseSession.add_all(arr)
    GlobalEnv.GlobalDataBaseSession.commit()