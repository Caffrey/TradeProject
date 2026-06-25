'use client';

import EquityCurve from "@/app/components/EquityCurve";
import Histogram from "@/app/components/Histogram";
import TradeHisotryFilter from "@/app/components/TradeHisotryFilter";

export default function TradeAnalysis()
{
    return (
        <div className="w-full">
            <TradeHisotryFilter/>
            <Histogram/>
        </div>

    );
}