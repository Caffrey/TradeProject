import MetaTrader5 as mt5
import pandas as pd
from pandas import DataFrame
from datetime import datetime
from src import env as GlobalEnv

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
