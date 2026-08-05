import {
    ISeriesPrimitive,
    IPrimitivePaneView,
    IPrimitivePaneRenderer,
    SeriesAttachedParameter,
    Time,
} from "lightweight-charts";
import { CanvasRenderingTarget2D, BitmapCoordinatesRenderingScope } from "fancy-canvas";

// ─── 一笔完整交易（entry + exit 坐标 + 方向/盈亏） ──────────────────────────
export interface TradePair {
    entryTime:  Time;
    entryPrice: number;
    exitTime:   Time;
    exitPrice:  number;
    isLong:     boolean;  // 决定箭头朝向
    pnl:        number;   // 决定颜色
}

// ─── Canvas 渲染器：画连线 + entry/exit 箭头 ─────────────────────────────────
class TradeRenderer implements IPrimitivePaneRenderer {
    private _trades: TradePair[];
    private _param:  SeriesAttachedParameter<Time> | null;

    constructor(trades: TradePair[], param: SeriesAttachedParameter<Time> | null) {
        this._trades = trades;
        this._param  = param;
    }

    draw(target: CanvasRenderingTarget2D): void {
        if (!this._param) return;

        target.useBitmapCoordinateSpace((scope: BitmapCoordinatesRenderingScope) => {
            const { context: ctx, bitmapSize, mediaSize } = scope;
            const dpr  = bitmapSize.width / mediaSize.width;
            const size = 7 * dpr;

            const timeScale = this._param!.chart.timeScale();
            const series    = this._param!.series;

            this._trades.forEach((trade) => {
                const ex = timeScale.timeToCoordinate(trade.entryTime);
                const ey = series.priceToCoordinate(trade.entryPrice);
                const lx = timeScale.timeToCoordinate(trade.exitTime);
                const ly = series.priceToCoordinate(trade.exitPrice);

                if (ex === null || ey === null || lx === null || ly === null) return;

                const bex = ex * dpr;
                const bey = ey * dpr;
                const blx = lx * dpr;
                const bly = ly * dpr;

                const lineColor  = trade.pnl >= 0 ? "#26a69a" : "#ef5350";
                const entryColor = "#2196F3";
                const exitColor  = lineColor;

                // ── 连线（虚线） ──────────────────────────────────────────
                ctx.save();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth   = 1.5 * dpr;
                ctx.setLineDash([4 * dpr, 4 * dpr]);
                ctx.beginPath();
                ctx.moveTo(bex, bey);
                ctx.lineTo(blx, bly);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();

                // ── Entry 箭头 ────────────────────────────────────────────
                // 多头 entry → ▲（顶点朝上），空头 entry → ▼（顶点朝下）
                ctx.save();
                ctx.fillStyle = entryColor;
                ctx.beginPath();
                if (trade.isLong) {
                    ctx.moveTo(bex,          bey - size);
                    ctx.lineTo(bex + size,   bey + size * 0.6);
                    ctx.lineTo(bex - size,   bey + size * 0.6);
                } else {
                    ctx.moveTo(bex,          bey + size);
                    ctx.lineTo(bex + size,   bey - size * 0.6);
                    ctx.lineTo(bex - size,   bey - size * 0.6);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                // ── Exit 箭头 ─────────────────────────────────────────────
                // 多头 exit → ▼（顶点朝下），空头 exit → ▲（顶点朝上）
                ctx.save();
                ctx.fillStyle = exitColor;
                ctx.beginPath();
                if (trade.isLong) {
                    ctx.moveTo(blx,          bly + size);
                    ctx.lineTo(blx + size,   bly - size * 0.6);
                    ctx.lineTo(blx - size,   bly - size * 0.6);
                } else {
                    ctx.moveTo(blx,          bly - size);
                    ctx.lineTo(blx + size,   bly + size * 0.6);
                    ctx.lineTo(blx - size,   bly + size * 0.6);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            });
        });
    }
}

// ─── PaneView ────────────────────────────────────────────────────────────────
class TradePaneView implements IPrimitivePaneView {
    private _trades: TradePair[];
    private _param:  SeriesAttachedParameter<Time> | null = null;

    constructor(trades: TradePair[]) {
        this._trades = trades;
    }

    update(param: SeriesAttachedParameter<Time>) {
        this._param = param;
    }

    renderer(): IPrimitivePaneRenderer {
        return new TradeRenderer(this._trades, this._param);
    }
}

// ─── Primitive（对外暴露） ────────────────────────────────────────────────────
export class TradeArrowPrimitive implements ISeriesPrimitive<Time> {
    private _paneView: TradePaneView;

    constructor(trades: TradePair[]) {
        this._paneView = new TradePaneView(trades);
    }

    attached(param: SeriesAttachedParameter<Time>) {
        this._paneView.update(param);
    }

    detached() { /* nothing */ }

    paneViews(): readonly IPrimitivePaneView[] {
        return [this._paneView];
    }
}
