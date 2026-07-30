import asyncio
from pydantic import BaseModel,Field
from typing import List
import json
import src.env as GlobalEnv
from datetime import date
from . import market_data as MarketDataEngine


class MarketDataConfigSymbolItem(BaseModel):
        name:str
        symbol:str

class MarketDataConfigItem(BaseModel):
    intervals: List[str]
    symbols: List[MarketDataConfigSymbolItem]
    market : str

class GroupMarketDataConfigItem(BaseModel):
    symbols:List[str] = Field(default_factory=list)
    intervals: List[str] =  Field(default_factory=list)

class MarketDataConfig(BaseModel):
    stock: MarketDataConfigItem
    future: MarketDataConfigItem
    froex: MarketDataConfigItem

class AutoUpdateCache(BaseModel):
     StartDate:date
     LastestUpdateDate:date

class UpdatePackage:
     def __init__(self):
          self.updateItem:GroupMarketDataConfigItem = None
          self.market = ""
          self.startDate = date.today()
          self.endDate = date.today()

async def AutoUpdate(item:UpdatePackage ,updateInterval):

    while True:
        for interval in item.updateItem.intervals:
            print( f"update {item.updateItem.symbols}__ {interval} Start:{item.startDate}__ end:{item.endDate}" )
            MarketDataEngine.DownHistoryDateToDataBase(item.market,
                                                        item.updateItem.symbols,
                                                        interval,
                                                        item.startDate,
                                                        item.endDate)
            print( f"update {item.updateItem.symbols}__ {interval} Start:{item.startDate}__ end:{item.endDate} _____ Complete" )
            
            await asyncio.sleep(updateInterval)
        break

        
def LoadConfig():
    Config_Path = GlobalEnv.BASE_DIR / "config"/ "market_history_config.json"
    print(Config_Path)
    with open(Config_Path,'r') as file:
        data = json.load(file)
        config = MarketDataConfig(**data)

        return config

def ConfigToContinueDownloadConfig(config:MarketDataConfigItem):
    item = GroupMarketDataConfigItem()

    for x in config.intervals : item.intervals.append(x)
    for x in config.symbols: item.symbols.append(x.symbol)

    return item


def MakeUpdatePackges(item:MarketDataConfigItem, startDate : date, endDate:date):
    result = UpdatePackage()
    result.updateItem = ConfigToContinueDownloadConfig(item)
    result.market = item.market
    result.startDate = startDate
    result.endDate = endDate
    return result
