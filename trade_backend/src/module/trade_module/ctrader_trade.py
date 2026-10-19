
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

def parse_ctrader_datetime(value):
    return datetime.strptime(
        value,
        "%d/%m/%Y %H:%M:%S.%f"
    )


def Trade_ProcessCtraderDataFrame(df : DataFrame):
    arr = []
    for index, row in df.iterrows():

        trade = TradeRecord()
        trade.Symbol =  row['Symbol']
        trade.SourceSymbol = row['Symbol']

        trade.OpenTime = parse_ctrader_datetime(row['Opening time'])
        trade.Lot = row['Closing Quantity']

        trade.OpenVolume = row['Requested quantity']
        trade.CloseVolume = row['Closing Quantity']
        trade.OpenPrice = row['Entry price']
        trade.ClosePrice = row['Closing price']

        trade.CloseTime = parse_ctrader_datetime(row['Closing time'])
        trade.Tick = row['Pips']
        trade.Pnl = row['Net $']
        trade.TradeRecordType = TradeModuleConfig.RECORD_TYPE_CTRADER

        arr.append(trade)
    return arr