import src.env as GlobalEnv
from src.serverApp import InitServer
from src.dataBase import InitDataBase
from src.server_trade import Trade_ClearTable,Trade_RefreshAtasDataBase
from sqlalchemy.orm import declarative_base

# start program
GlobalEnv.GlobalDataBaseSession = InitDataBase()
app = InitServer()
GlobalEnv.GlobalServerApp = app

Trade_ClearTable()
Trade_RefreshAtasDataBase()






    

