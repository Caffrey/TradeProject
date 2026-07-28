from fastapi import FastAPI
from fastapi import FastAPI ,Form, UploadFile,File
from typing import Optional

from src.server_trade import Trade_Router

def InitServer():
    GlobalServerApp = FastAPI()
    GlobalServerApp.include_router(Trade_Router)
    return GlobalServerApp
    
    




    

