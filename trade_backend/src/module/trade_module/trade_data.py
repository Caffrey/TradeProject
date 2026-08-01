
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, BigInteger, Text,DateTime,Numeric
import re

def Trade_FilterSymbolName(Name:str):
    code = Name

    match = re.search(
            r'#?([A-Z]{1,3})(?=[FGHJKMNQUVXZ]\d|$)',
            code
        )

    if not match:
        raise ValueError(f"非法代码: {code}")

    return match.group(1)

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
    Lot = Column(BigInteger)
    Tick = Column(BigInteger)
    Pnl = Column(Numeric)
    SourceSymbol = Column(Text)
    Acount = Column(Text)
    TradeRecordType = Column(Text)
    PositionID = Column(BigInteger)
