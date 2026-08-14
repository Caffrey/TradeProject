

import CandleCharts from "./CandleCharts";
import { Request_HistoryData } from "@/requests/requestMarketData";
import { CandleSitckSeriesData,HistoryData, TranslateCandleToTradingviewCandle } from "@/data/historyData";
import CustomRadialBarChart from "../CustomRadialBarChart";

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
    return(
        <div >
            <CandleCharts CandleDatas={Datas}/>
            <CustomRadialBarChart ChartName="Test"/>
            
        </div>
    );
}