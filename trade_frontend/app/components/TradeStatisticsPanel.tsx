"use clinet"
import { TradeStatisticsData } from "../data/TradeData"

export default function TradeStatisticsPanel(
    {StatisticsData}:
    {StatisticsData:TradeStatisticsData}
)
{
    return (
        <div>
            <h2>Trade Statistics Data</h2>

            <div>ProfitFactor:{StatisticsData.ProfitFactor.toFixed(2)} </div>
            <div>TradeCount:{StatisticsData.TradeCount} </div>
            <div>TotalProfit:{StatisticsData.TotalProfit.toFixed(0)} </div>
            <div>TotalLost:{StatisticsData.TotalLost.toFixed(0)} </div>
            <div>WinRate:{StatisticsData.WinRate.toFixed(2)} %</div>
            <div>AverageWin:{StatisticsData.AverageWin.toFixed(2)} </div>
            <div>AverageLost:{StatisticsData.AverageLost.toFixed(2)} </div>
            <div>----</div>
            <div>HistoryPeak:{StatisticsData.HistoryPeak.toFixed(0)} </div>
            <div>MaxDrawback:{StatisticsData.MaxDrawback.toFixed(0)} </div>
            <div>MaxDrawbackRate:{StatisticsData.MaxDrawbackRate.toFixed(2)}% </div>

        </div>
    );

}