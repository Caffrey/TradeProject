from openbb import obb
from src.market_data_engine.market_data_auto_update import *
from datetime import datetime,date
import json
import asyncio

config = LoadConfig()
d = datetime(2026,7,28)
a:UpdatePackage= MakeUpdatePackges(config.future,d,datetime.today())

print(a.updateItem)


# r = obb.derivatives.futures.historical(symbol=configdate.symbols,interval=configdate.intervals[0],
#                                    start_date=d,
#                                    end_date=date.today())
