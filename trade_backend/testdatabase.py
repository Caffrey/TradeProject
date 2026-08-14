import src.env as GlobalEnv
from src.server_app import InitServer
from src.module.database_module.database import InitDataBase
from src.module.market_data_engine import market_data as MD
from datetime import date

# start program
GlobalEnv.GlobalDataBaseSession = InitDataBase()
# app = InitServer()
# GlobalEnv.GlobalServerApp = app

result = MD.GetValidSymbol("Froex")
print(result)

result2 = MD.GetValidTimeFrame("Froex","XAUUSD")
print(result2)


    
# result3 =MD.GetMarketData("Froex","XAUUSD","D1",date(2023,5,1),date(2024,5,1))
# print(result3)

queryData = MD.GetMarketDataQuery("Froex","USATECHIDXUSD","H1",date(2026,3,1),date(2026,5,1))

result4 = MD.GetIntradayHourDisributionWithBearBull(queryData,23,5,False,False)
result4 = MD.GetIntradayHourDisributionWithBearBull(queryData,23,5,True,False)
print(result4)