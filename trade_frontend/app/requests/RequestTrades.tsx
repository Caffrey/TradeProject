import { PreProcessTradeData,TradeData } from "../data/tradeData";

const ServerPath = "http://localhost:8000/"


export async function Request_RefreshAtasTrades()
{
    const params = new URLSearchParams({ RecordType:"ATAS" });

    const res = await fetch(
    `${ServerPath}rest_trade/RefreshTradeRecordDataBase?${params.toString()}`,
    {
        cache:"no-store",
        method:"POST",
    }
    );
}

export async function Request_RefreshMT5Trades()
{
    const params = new URLSearchParams({
                RecordType:'MT5'
            });

        const res = await fetch(
        `${ServerPath}rest_trade/RefreshTradeRecordDataBase?${params.toString()}`,
        {
            cache:"no-store",
            method:"POST",
        }
    );
}


export async function Request_TradeValidSymbols()
{
    console.log("askdjfkasdf")
    console.log(`${ServerPath}rest_trade/GetValidSymbol`)
    const res = await fetch(
        `${ServerPath}rest_trade/GetValidSymbol`,
        {
            cache:"no-store",
            method:"GET"
        }
    );
    return res.json()
}



export async function Request_GetTrades(
     StartDate?:string,
        EndDate?:string,
        SymbolName?:string
)

{
      let trades:TradeData[] = [];

     if(StartDate && EndDate && SymbolName)
     {

         const params = new URLSearchParams({
            StartDate,
            EndDate,
            SymbolName
         });

          const res = await fetch(

            `${ServerPath}rest_trade/GetTradeData?${params.toString()}`,
            {
                cache:"no-store"
            }
        );

        trades = await res.json();
     }
     
    PreProcessTradeData(trades);
    return trades
}
    