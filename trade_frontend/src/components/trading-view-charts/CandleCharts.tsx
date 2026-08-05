"use client";

import { createChart, CandlestickSeries, Time, CrosshairMode } from "lightweight-charts";
import { CandleSitckSeriesData } from "@/data/historyData";
import { TradeData } from "@/data/tradeData";
import { TradeArrowPrimitive, TradePair } from "./TradeArrowPrimitive";
import { useEffect, useRef } from "react";

// ── 测试用伪造数据 ────────────────────────────────────────────────────────────
const MOCK_TRADES: TradePair[] = [
    {
        entryTime:  Math.floor(new Date("2026-07-19T18:00:00Z").getTime() / 1000) as Time,
        entryPrice: 4009,
        exitTime:   Math.floor(new Date("2026-07-19T23:00:00Z").getTime() / 1000) as Time,
        exitPrice:  4040,
        isLong: true,
        pnl:    31,
    },
    {
        entryTime:  Math.floor(new Date("2026-07-20T12:00:00Z").getTime() / 1000) as Time,
        entryPrice: 4006,
        exitTime:   Math.floor(new Date("2026-07-21T02:00:00Z").getTime() / 1000) as Time,
        exitPrice:  4069,
        isLong: true,
        pnl:    -63,
    },
];

export default function CandleCharts(
    {
        CandleDatas,
        TradeMarkers,
    }:
    {
        CandleDatas: CandleSitckSeriesData[];
        TradeMarkers?: TradeData[];
    }
)
{
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width:  chartContainerRef.current.clientWidth || 800,
            height: 400,
            timeScale:{
                timeVisible:true,
                secondsVisible:true
            },
            crosshair:
            {
                mode:CrosshairMode.Normal,
            }
        });

        // ── K 线主图 ──────────────────────────────────────────────────────────
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor:       "#26a69a",
            downColor:     "#ef5350",
            borderVisible: false,
            wickUpColor:   "#26a69a",
            wickDownColor: "#ef5350",
        });
        // CandleSitckSeriesData.time 是 number（unix秒），轻量图表 Time 兼容
        candleSeries.setData(CandleDatas as any);

        // ── 交易标记（连线 + 箭头全在 Primitive 内画） ────────────────────────
        // 有真实数据用真实数据，否则用 MOCK 数据测试
        let tradePairs: TradePair[];
        if (TradeMarkers && TradeMarkers.length > 0) {
            tradePairs = TradeMarkers.map((trade) => ({
                entryTime:  Math.floor(new Date(trade.OpenTime).getTime()  / 1000) as Time,
                entryPrice: trade.OpenPrice,
                exitTime:   Math.floor(new Date(trade.CloseTime).getTime() / 1000) as Time,
                exitPrice:  trade.ClosePrice,
                isLong:     trade.Tick >= 0,
                pnl:        trade.Pnl,
            }));
        } else {
            tradePairs = MOCK_TRADES;
        }
        candleSeries.attachPrimitive(new TradeArrowPrimitive(tradePairs));

        chart.timeScale().fitContent();

        return () => {
            chart.remove();
        };
    }, [CandleDatas, TradeMarkers]);

    return (
        <div ref={chartContainerRef} className="w-full h-[400px]" />
    );
}
