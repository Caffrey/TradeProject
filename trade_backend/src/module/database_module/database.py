from src import env as GlobalEnv

from src.module.trade_module.server_trade import *
from src.module.market_data_engine.market_data import DB_CandleData

from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from sqlalchemy.orm import declarative_base


def InitDataBase():
    Base = declarative_base()
    engine = create_engine(GlobalEnv.DATABASE_URL)
    Session_local = sessionmaker(bind=engine,
                        autoflush=False,
                        autocommit=False)

    User.metadata.create_all(bind=engine)
    TradeRecord.metadata.create_all(bind=engine)
    DB_CandleData.metadata.create_all(bind=engine)

    return Session_local()
