import { PreProcessTradeData,TradeData } from "../data/TradeData";

const ServerPath = "http://localhost:8000/"


export async function Request_RefreshAtasTrades()
{
    const params = new URLSearchParams({ RecordType:"ATAS" });

    const res = await fetch(
    `${ServerPath}RefreshTradeRecordDataBase?${params.toString()}`,
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
        `${ServerPath}RefreshTradeRecordDataBase?${params.toString()}`,
        {
            cache:"no-store",
            method:"POST",
        }
    );

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

            `${ServerPath}GetTradeData?${params.toString()}`,
            {
                cache:"no-store"
            }
        );

        trades = await res.json();
     }
     
    PreProcessTradeData(trades);
    return trades
}
    