import src.env as GlobalEnv
from src.serverApp import InitServer
from src.DataBase import InitDataBase
from src.server_trade import Trade_ClearTable,Trade_RefreshAtasDataBase
from sqlalchemy.orm import declarative_base

##
from openbb import obb
from src.marketDataEngine.market_data_auto_update import *
from datetime import date
import json
import asyncio

##

# start program
GlobalEnv.GlobalDataBaseSession = InitDataBase()
app = InitServer()
GlobalEnv.GlobalServerApp = app

Trade_ClearTable()
Trade_RefreshAtasDataBase()



config = LoadConfig()
d = date(2026,7,1)
result:UpdatePackage = MakeUpdatePackges(config.future,d,date.today())
# result2 = MakeUpdatePackges(config.froex)
# result3 = MakeUpdatePackges(config.future)
asyncio.create_task(
    AutoUpdate(result,5)
)




    

