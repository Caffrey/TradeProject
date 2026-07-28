
import TradeChart from "./TradeChart";
import TradeStatisticsPanel from "./TradeStatisticsPanel";
import ReturnOfDistributionPanel from "./ReturnOfDistributionPanel";

import { Request_GetTrades } from "../requests/TradeDataServer";
import { TradeData,StatisticsTradeData,TradeStatisticsData} from "../data/TradeData";

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
            <h2>
                Trade Result
            </h2>
            <TradeChart TradeRecords={trades} />
            <TradeStatisticsPanel StatisticsData={StatisticsData}/>
            <ReturnOfDistributionPanel TradeDatas={trades}/>
        </div>
    );
}