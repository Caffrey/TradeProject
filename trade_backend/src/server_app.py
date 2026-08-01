from fastapi import FastAPI
from fastapi import FastAPI ,Form, UploadFile,File
from typing import Optional

from src.rest_module.rest_trade_module import Trade_Router
from src.rest_module.rest_maket_data import MarketDataRoute


def InitServer():
    GlobalServerApp = FastAPI()
    GlobalServerApp.include_router(Trade_Router)
    GlobalServerApp.include_router(MarketDataRoute)
    return GlobalServerApp
    
    




    

