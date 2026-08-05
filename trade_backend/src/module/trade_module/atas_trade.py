
from src import env as GlobalEnv
from .trade_data import *
import pandas as pd
from pandas import DataFrame
from . import trade_module_config as TradeModuleConfig
from datetime import timezone,datetime,timedelta

from src.module.common_module import common_function as CommonFunction

def china_time_to_utc_str(time_value):

    # pandas Timestamp
    if isinstance(time_value, pd.Timestamp):
        dt = time_value.to_pydatetime()

    # 字符串
    elif isinstance(time_value, str):
        dt = datetime.strptime(
            time_value,
            "%Y-%m-%d %H:%M:%S.%f"
        )

    else:
        raise TypeError(f"Unsupported type: {type(time_value)}")

    # 输入认为是 UTC+8
    dt = dt.replace(
        tzinfo=timezone(timedelta(hours=8))
    )

    # 转 UTC
    utc_dt = dt.astimezone(timezone.utc)

    # 返回字符串
    return utc_dt.strftime(
        "%Y-%m-%d %H:%M:%S.%f"
    )


def Trade_ProcessAtasDataFrame(df : DataFrame):
    
    #incase none complete records
    if  not ("Close volume" in df.columns):
        return 
    
    arr = []
    for index, row in df.iterrows():

        trade = TradeRecord()
        trade.Symbol =  CommonFunction.Trade_FilterSymbolName(row['Instrument'])
        trade.SourceSymbol = row['Instrument']

        trade.OpenTime = china_time_to_utc_str(row['Open time'])
        trade.Lot = row['Open volume']

        trade.OpenVolume = row['Open volume']
        trade.CloseVolume = row['Close volume']
        trade.OpenPrice = row['Open price']
        trade.ClosePrice = row['Close price']

        trade.CloseTime = china_time_to_utc_str(row['Close time'] if pd.notna(row['Close time']) else row["Open time"])
        trade.Tick = row['Profit (ticks)']
        trade.Pnl = row['PnL']
        trade.TradeRecordType = TradeModuleConfig.RECORD_TYPE_ATAS

        arr.append(trade)
    GlobalEnv.GlobalDataBaseSession.add_all(arr)
    GlobalEnv.GlobalDataBaseSession.commit()