from fastapi import FastAPI
from fastapi import FastAPI ,Form, UploadFile,File
from fastapi.middleware.cors import CORSMiddleware

from src.rest_module.rest_trade_module import Trade_Router
from src.rest_module.rest_maket_data import MarketDataRoute


def InitServer():
    GlobalServerApp = FastAPI()
    GlobalServerApp.include_router(Trade_Router)
    GlobalServerApp.include_router(MarketDataRoute)

    origins = [
    "http://localhost:3000",
]

    GlobalServerApp.add_middleware(
        CORSMiddleware,
        allow_origins=origins,  # 允许指定域访问，生产环境可以更严格
        allow_credentials=True,
        allow_methods=["*"],  # 允许所有 HTTP 方法 (GET, POST 等)
        allow_headers=["*"],  # 允许所有请求头
    )

    return GlobalServerApp
    
    




    

