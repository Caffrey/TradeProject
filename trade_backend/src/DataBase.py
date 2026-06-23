from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, BigInteger, Text

Base = declarative_base()

class User(Base):
    __tablename__ = 'User'

    ID = Column(BigInteger, primary_key=True)
    UserName = Column(Text)
    Password = Column(Text)


DATABASE_URL = "postgresql://postgres:123123@localhost:5432/Trade"

engine = create_engine(DATABASE_URL)
SessionA = sessionmaker(bind=engine,
                       autoflush=False,
                       autocommit=False)

#API

db = SessionA()
a = db.query(User).all()
for u in a:
    print(u.ID, u.UserName, u.Password)