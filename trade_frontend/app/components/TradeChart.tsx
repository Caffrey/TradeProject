"use client";

import Histogram from "./Histogram";
import { TradeData } from "../data/TradeData";

export default function TradeChart(
    {
        TradeRecords
    }:
    {
        TradeRecords?:TradeData[]| undefined
    }
) {
    return (
        <div>
            <h2>Equity Curve</h2>
            <Histogram TradeRecords={TradeRecords} />
        </div>
    );
}
