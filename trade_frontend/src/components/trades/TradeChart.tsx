"use client";

import Histogram from "@/components/Histogram";
import { TradeData } from "@/data/tradeData";

export default function TradeChart(
    {
        TradeRecords,
        ShowRule
    }:
    {
        TradeRecords:TradeData[],
        ShowRule?:boolean

    }
) {

    return (
        <div className="card bg-base-100 w-96 shadow-sm w-full">
            <h2 className="text-3xl font-bold">Equity Curve</h2>
            <Histogram TradeRecords={TradeRecords} ShowRule={ShowRule}/>
        </div>
    );
}
