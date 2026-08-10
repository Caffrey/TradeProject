import { PreProcessTradeData,TradeData } from "@/data/tradeData";
import {REST_SERVER_PATH} from "@/requests/requestsConfig.tsx"
import { fetchWithTimeZoneProcess } from "@/utils/globalFetch";


export async function Request_RefreshAtasTrades()
{
    const params = new URLSearchParams({ RecordType:"ATAS" });

    const res = await fetch(
    `${REST_SERVER_PATH}rest_trade/RefreshTradeRecordDataBase?${params.toString()}`,
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
        `${REST_SERVER_PATH}rest_trade/RefreshTradeRecordDataBase?${params.toString()}`,
        {
            cache:"no-store",
            method:"POST",
        }
    );
}


export async function Request_TradeValidSymbols()
{
    const res = await fetch(
        `${REST_SERVER_PATH}rest_trade/GetFilterData`,
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
        Platfotm?:string,
        Account?:string,
        Strategy?:string,
        SymbolName?:string
)

{
      let trades:TradeData[] = [];

     if(StartDate && EndDate && SymbolName && Strategy && Platfotm && Account)
     {

         const params = new URLSearchParams({
            StartDate,
            EndDate,
            Platfotm,
            Account,
            Strategy,
            SymbolName
         });

       trades = await fetchWithTimeZoneProcess<TradeData[]>(

            `${REST_SERVER_PATH}rest_trade/GetTradeData?${params.toString()}`,
            {
                cache:"no-store"
            }
        );
     }
     
    PreProcessTradeData(trades);
    return trades
}
    