

import TradeChart from "@/components/trades/TradeChart";
import TradeStatisticsPanel from "@/components/trades/TradeStatisticsPanel";
import ReturnOfDistributionPanel from "./ReturnOfDistributionPanel";

import { Request_GetTrades } from "@/requests/requestTrades";
import { TradeData,StatisticsTradeData,TradeStatisticsData} from "@/data/tradeData";

export default async function TradeAnalysisPanel
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

    let trades:TradeData[] = await Request_GetTrades(StartDate,EndDate,SymbolName);
    let StatisticsData:TradeStatisticsData = StatisticsTradeData(trades);


    return(
        <div >
            <TradeStatisticsPanel StatisticsData={StatisticsData}/>
            <TradeChart TradeRecords={trades} />
            <ReturnOfDistributionPanel TradeDatas={trades}/>
        </div>
    );
}