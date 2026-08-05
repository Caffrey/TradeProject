import {REST_SERVER_PATH} from "@/requests/requestsConfig.tsx"
import { HistoryData } from "@/data/historyData";
import { fetchWithTimeZoneProcess } from "@/utils/globalFetch";

export async function Request_RefreshFutre()
{
    const res = await fetch(
        `${REST_SERVER_PATH}market_data/RefreshFuture`,
        {
            cache:"no-store",
            method:"GET"
        }
    );
    console.log(res.json)
    return res.json()
}

export async function Request_MarketDataValidSymbols(market:string)
{
      const params = new URLSearchParams({
            market,
         });

    const res = await fetch(
        `${REST_SERVER_PATH}market_data/GetValidSymbol?${params.toString()}`,
        {
            cache:"no-store",
            method:"GET"
        }
    );
    return res.json()
}

export async function Request_HistoryData(market:string,symbol:string|undefined)
{
    if (symbol == undefined)
    {
        return[]
    }
    
    let datas:HistoryData[] = []
    const params = new URLSearchParams({
            market,
            symbol,
         });

        datas = await fetchWithTimeZoneProcess<HistoryData[]>(

        `${REST_SERVER_PATH}market_data/HistoryData?${params.toString()}`,
        {
            cache:"no-store"
        }
    );

    datas.forEach(item=>
        {
            item.DateTime = new Date(item.Date);
        }
    )

    return datas
}