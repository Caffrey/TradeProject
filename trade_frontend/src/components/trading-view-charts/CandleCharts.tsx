"use client";

import { createChart, CandlestickSeries } from "lightweight-charts";
import { CandleSitckSeriesData } from "@/data/historyData";
import { useEffect, useRef } from "react";

export default function CandleCharts
(
    {
        CandleDatas,
    }:
    {
        CandleDatas:CandleSitckSeriesData[]
    }
)
{
    const chartContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
        width: 800,
        height: 400,
        });

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
        });

        console.log(CandleDatas)
        candleSeries.setData(CandleDatas)
        chart.timeScale().fitContent();

        return () => {
            chart.remove();
        };
    },[CandleDatas]);
    return (
        <div ref={chartContainerRef} className="w-full h-[400px]">

        </div>
    )
}