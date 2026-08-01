import src.env as GlobalEnv
from src.server_app import InitServer
from src.module.database_module.database import InitDataBase


# start program
GlobalEnv.GlobalDataBaseSession = InitDataBase()
app = InitServer()
GlobalEnv.GlobalServerApp = app



    

