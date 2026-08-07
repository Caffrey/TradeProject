

import CandleCharts from "./CandleCharts";
import { Request_HistoryData } from "@/requests/requestMarketData";
import { CandleSitckSeriesData,HistoryData, TranslateCandleToTradingviewCandle } from "@/data/historyData";

export default async function MarketDataDisplayPanel
(
       {
        StartDate,
        EndDate,
        SymbolName
    }:{
        StartDate?:string,
        EndDate?:string,
        SymbolName?:string
    }
)
{

    let historyDatas:HistoryData[] = await Request_HistoryData("future",SymbolName);
    let Datas: CandleSitckSeriesData[] = TranslateCandleToTradingviewCandle(historyDatas)
    console.log("lkasdjflakjsdfljk")
    return(
        <div >
            <CandleCharts CandleDatas={Datas}/>
        </div>
    );
}