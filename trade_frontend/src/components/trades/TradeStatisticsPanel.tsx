"use clinet"
import { TradeStatisticsData } from "@/data/tradeData"
import NormalCardPanel from "./NormalCardPanel";
import {NormalCardPanel2} from "./NormalCardPanel";

export default function TradeStatisticsPanel(
    {StatisticsData}:
    {StatisticsData:TradeStatisticsData}
)
{
    return (
        <div>
            <h2 className="text-2xl font-bold">Trade Statistics Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <NormalCardPanel
                        Title="Net Pnl"
                        Content={(StatisticsData.TotalProfit-StatisticsData.TotalLost).toFixed(0)}
                        SubContent={`${StatisticsData.TradeCount}Trades`}
                    />

                    <NormalCardPanel
                        Title="Win Rate"
                        Content={`${StatisticsData.WinRate.toFixed(2)} %`}
                        SubContent={`${StatisticsData.WinCount} / ${StatisticsData.LostCount}`}
                    />

                    <NormalCardPanel2
                        Title={`Avg Win/Lost: ${StatisticsData.ProfitFactor.toFixed(2)}`}
                        Content={`Win $${StatisticsData.AverageWin.toFixed(0)}`}
                        SubContent={`Lost -$${StatisticsData.AverageLost.toFixed(0)}`}
                    />

                    <NormalCardPanel
                        Title="Max DrawDown"
                        Content={`-$${StatisticsData.MaxDrawback.toFixed(0)}__Peak:${StatisticsData.HistoryPeak.toFixed(0)}`}
                        SubContent={`$${StatisticsData.MaxDrawbackRate.toFixed(2)}%`}
                    />

                    <NormalCardPanel
                        Title="Trade Sharp : Model Performance"
                        Content={`${StatisticsData.Sharp.toFixed(2)}`}
                        SubContent=""
                    />
                     <NormalCardPanel
                        Title="Consecutive "
                        Content={`max Consecutive win:${StatisticsData.MostConsecutiveWin.toFixed(0)}`}
                        SubContent={`max Consecutive lost:${StatisticsData.MostConsecutiveLosses.toFixed(0)}`}
                    />
                </div>
        </div>
    );

}