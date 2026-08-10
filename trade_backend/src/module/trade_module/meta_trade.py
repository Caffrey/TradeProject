import MetaTrader5 as mt5
import pandas as pd
from pandas import DataFrame
from datetime import datetime
from src import env as GlobalEnv
from .trade_data import *
from . import trade_module_config as TradeModuleConfig

def ExpotallMetaTradeHistory():
    mt5.initialize()
    result:DataFrame = GetTradeJournry(trades=GetTradeHistory())
    result.to_csv(GlobalEnv.ExnessTradePath)
    mt5.shutdown()


def GetTradeHistory():
    deals = mt5.history_deals_get(
    datetime(2026,1,1),
    datetime.now()
    )

    df = pd.DataFrame(
        [d._asdict() for d in deals]
    )

    df["time"] = pd.to_datetime(
        df["time"],
        unit="s"
    )
    return df


def GetTradeJournry(trades:DataFrame):
    trade_df = (
        trades.groupby("position_id")
        .apply(
            lambda x: pd.Series({
                "symbol": x["symbol"].iloc[0],

                "direction":
                    "BUY" if x[x["entry"] == 0]["type"].iloc[0] == 0 else "SELL",

                "entry_time":
                    x[x["entry"] == 0]["time"].iloc[0],

                "entry_price":
                    x[x["entry"] == 0]["price"].iloc[0],

                "exit_time":
                    x[x["entry"] == 1]["time"].iloc[-1],

                "exit_price":
                    x[x["entry"] == 1]["price"].iloc[-1],

                "volume":
                    x["volume"].sum(),

                "profit":
                    x["profit"].sum(),

                "commission":
                    x["commission"].sum(),

                "swap":
                    x["swap"].sum(),
            })
            if (
                len(x[x["entry"] == 0]) > 0
                and
                len(x[x["entry"] == 1]) > 0
            )
            else None
        )
        .dropna()
        .reset_index()
    )
    return trade_df


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

        direction = 1
        if row['direction'] == "SELL":
            direction = -1

        trade.OpenVolume = row['volume'] * direction
        trade.CloseVolume = row['volume'] *direction*-1
        trade.OpenPrice = row['entry_price']
        trade.ClosePrice = row['exit_price']

        trade.TradeRecordType = TradeModuleConfig.RECORD_TYPE_MT5
        arr.append(trade)
    return arr
