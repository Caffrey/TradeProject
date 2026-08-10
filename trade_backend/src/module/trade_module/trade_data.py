
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, BigInteger, Text,DateTime,Numeric



class User(declarative_base()):
    __tablename__ = 'User'

    ID = Column(BigInteger, primary_key=True)
    UserName = Column(Text)
    Password = Column(Text)

class TradeRecord(declarative_base()):
    __tablename__= "TradeRecord"
    ID = Column(BigInteger,primary_key=True,autoincrement=True)
    Symbol = Column(Text)
    OpenTime = Column(DateTime(timezone=False))
    CloseTime = Column(DateTime(timezone=False))
    OpenPrice = Column(Numeric)
    ClosePrice = Column(Numeric)
    OpenVolume = Column(BigInteger)
    CloseVolume = Column(BigInteger)
    Lot = Column(BigInteger)
    Tick = Column(BigInteger)
    Pnl = Column(Numeric)
    SourceSymbol = Column(Text)
    Acount = Column(Text)
    TradeRecordType = Column(Text)
    Strategy = Column(Text)
    PositionID = Column(BigInteger)



