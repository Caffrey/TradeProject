
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, BigInteger, Text,DateTime,Numeric


class VolalityBase(declarative_base()):
    ID = Column(BigInteger, primary_key=True)
    Open = Column(Numeric)
    Close = Column(Numeric)
    High = Column(Numeric)
    Close = Column(Numeric)
    Volume = Column(BigInteger)
    Quanity = Column(BigInteger)
    VolumeType = Column(Text)
    Symbol = Column(Text)
    StartDate = Column(DateTime)
    EndData =Column(DateTime)

class FutureVolality(VolalityBase):
    __tablename__ = 'FutureVolality'


class StockVolality(VolalityBase):
    __tablename__ = 'StockVolality'
    Cap = Column(Numeric)

