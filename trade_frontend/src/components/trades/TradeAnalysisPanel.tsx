

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
        Platfotm,
        Account,
        Strategy,
        SymbolName,
        ShowRule, 
    }:{
        StartDate?:string,
        EndDate?:string,
        Platfotm?:string,
        Account?:string,
        Strategy?:string,
        SymbolName?:string,
        ShowRule?:boolean
    }
)
{

    let trades:TradeData[] = await Request_GetTrades(StartDate,EndDate,Platfotm,Account,Strategy,SymbolName);
    let StatisticsData:TradeStatisticsData = StatisticsTradeData(trades);
    

    return(
        <div >
            <TradeStatisticsPanel StatisticsData={StatisticsData}/>
            <TradeChart TradeRecords={trades} ShowRule={ShowRule} />
            <ReturnOfDistributionPanel TradeDatas={trades}/>
        </div>
    );
}