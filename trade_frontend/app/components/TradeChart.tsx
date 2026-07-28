"use client";

import Histogram from "./Histogram";

export default function TradeChart(
    {
        TradeRecords
    }:
    {
        TradeRecords?:[any]
    }
) {
    return (
        <div>
            <Histogram TradeRecords={TradeRecords} />
        </div>
    );
}
