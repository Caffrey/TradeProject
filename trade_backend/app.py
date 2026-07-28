import src.env as GlobalEnv
from src.serverApp import InitServer
from src.dataBase import InitDataBase


# start program

GlobalEnv.GlobalDataBaseSession = InitDataBase()
app = InitServer()
GlobalEnv.GlobalServerApp = app







    

