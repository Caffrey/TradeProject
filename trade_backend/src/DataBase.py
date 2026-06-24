from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, BigInteger, Text,DateTime,Numeric
import pandas as pd
from pandas import DataFrame

Base = declarative_base()

class User(Base):
    __tablename__ = 'User'

    ID = Column(BigInteger, primary_key=True)
    UserName = Column(Text)
    Password = Column(Text)

class TradeRecord(Base):
    __tablename__= "TradeRecord"
    ID = Column(BigInteger,primary_key=True,autoincrement=True)
    Symbol = Column(Text)
    OpenTime = Column(DateTime(timezone=False))
    CloseTime = Column(DateTime(timezone=False))
    Lot = Column(BigInteger)
    Tick = Column(BigInteger)
    Pnl = Column(Numeric)


DATABASE_URL = "postgresql://postgres:123123@localhost:5432/Trade"

engine = create_engine(DATABASE_URL)
SessionA = sessionmaker(bind=engine,
                       autoflush=False,
                       autocommit=False)

#API

db = SessionA()




def ProcessAtasDataFrame(df : DataFrame):
    arr = []
    for index, row in df.iterrows():
        trade = TradeRecord()
        trade.Symbol = row['Instrument']
        trade.OpenTime = row['Open time']
        trade.Lot = row['Open volume']
        trade.CloseTime = row['Close time'] if pd.notna(row['Close time']) else row["Open time"]
        trade.Tick = row['Profit (ticks)']
        trade.Pnl = row['PnL']
        arr.append(trade)
    db.add_all(arr)
    db.commit()



def TradeImport(df : DataFrame, TradeSheetType : str ):
    print
    match TradeSheetType:
        case "Atas" :
            ProcessAtasDataFrame(df)

