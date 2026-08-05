import {
    ISeriesPrimitive,
    IPrimitivePaneView,
    IPrimitivePaneRenderer,
    SeriesAttachedParameter,
    MouseEventParams,
    Time,
} from "lightweight-charts";
import { CanvasRenderingTarget2D, BitmapCoordinatesRenderingScope } from "fancy-canvas";

// ─── 一笔完整交易 ─────────────────────────────────────────────────────────────
export interface TradePair {
    entryTime:  Time;
    entryPrice: number;
    exitTime:   Time;
    exitPrice:  number;
    isLong:     boolean;
    pnl:        number;
}

// 鼠标媒体坐标
interface MousePos { x: number; y: number }

const ENTRY_COLOR = "#26a69a"; // buy  绿
const EXIT_COLOR  = "#ef5350"; // sell 红
const WIN_COLOR   = "#26a69a"; // 盈利线绿
const LOSS_COLOR  = "#ef5350"; // 亏损线红
const ARROW_SIZE  = 7;         // media px
const HIT_RADIUS  = 12;        // media px，tooltip 触发半径

// ─── 画一个圆角矩形气泡 ──────────────────────────────────────────────────────
function drawTooltip(
    ctx: CanvasRenderingContext2D,
    dpr: number,
    mx: number,  // media x
    my: number,  // media y
    lines: string[],
    color: string,
) {
    const fontSize   = 11 * dpr;
    const padding    = 6 * dpr;
    const lineHeight = 15 * dpr;
    const width      = 130 * dpr;
    const height     = lines.length * lineHeight + padding * 2;
    const radius     = 4 * dpr;

    // 气泡出现在箭头右上方，超出右边就往左
    let bx = mx * dpr + 10 * dpr;
    let by = my * dpr - height - 8 * dpr;
    if (by < 0) by = my * dpr + 10 * dpr;

    ctx.save();

    // 背景
    ctx.fillStyle   = "rgba(20,20,30,0.88)";
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.5 * dpr;
    ctx.beginPath();
    ctx.moveTo(bx + radius, by);
    ctx.lineTo(bx + width - radius, by);
    ctx.arcTo(bx + width, by, bx + width, by + radius, radius);
    ctx.lineTo(bx + width, by + height - radius);
    ctx.arcTo(bx + width, by + height, bx + width - radius, by + height, radius);
    ctx.lineTo(bx + radius, by + height);
    ctx.arcTo(bx, by + height, bx, by + height - radius, radius);
    ctx.lineTo(bx, by + radius);
    ctx.arcTo(bx, by, bx + radius, by, radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 文字
    ctx.fillStyle  = "#e0e0e0";
    ctx.font       = `${fontSize}px monospace`;
    ctx.textBaseline = "top";
    lines.forEach((line, i) => {
        ctx.fillText(line, bx + padding, by + padding + i * lineHeight);
    });

    ctx.restore();
}

// ─── Canvas 渲染器 ────────────────────────────────────────────────────────────
class TradeRenderer implements IPrimitivePaneRenderer {
    private _trades:   TradePair[];
    private _param:    SeriesAttachedParameter<Time> | null;
    private _mousePos: MousePos | null;

    constructor(
        trades:   TradePair[],
        param:    SeriesAttachedParameter<Time> | null,
        mousePos: MousePos | null,
    ) {
        this._trades   = trades;
        this._param    = param;
        this._mousePos = mousePos;
    }

    draw(target: CanvasRenderingTarget2D): void {
        if (!this._param) return;

        target.useBitmapCoordinateSpace((scope: BitmapCoordinatesRenderingScope) => {
            const { context: ctx, bitmapSize, mediaSize } = scope;
            const dpr       = bitmapSize.width / mediaSize.width;
            const size      = ARROW_SIZE * dpr;
            const timeScale = this._param!.chart.timeScale();
            const series    = this._param!.series;
            const mouse     = this._mousePos;

            // 收集需要显示 tooltip 的交易（hover 到 entry 或 exit 箭头）
            let tooltipTrade:  TradePair | null = null;
            let tooltipIsEntry = false;
            let tooltipMx = 0, tooltipMy = 0;

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

                const lineColor = trade.pnl >= 0 ? WIN_COLOR : LOSS_COLOR;

                // ── 连线（虚线，盈亏配色） ────────────────────────────────
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

                // ── Entry 箭头（buy → 绿色） ──────────────────────────────
                ctx.save();
                ctx.fillStyle = ENTRY_COLOR;
                ctx.beginPath();
                if (trade.isLong) {
                    // 多头买入 → ▲
                    ctx.moveTo(bex,        bey - size);
                    ctx.lineTo(bex + size, bey + size * 0.6);
                    ctx.lineTo(bex - size, bey + size * 0.6);
                } else {
                    // 空头买入（做空开仓）→ ▼
                    ctx.moveTo(bex,        bey + size);
                    ctx.lineTo(bex + size, bey - size * 0.6);
                    ctx.lineTo(bex - size, bey - size * 0.6);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                // ── Exit 箭头（sell → 红色） ──────────────────────────────
                ctx.save();
                ctx.fillStyle = EXIT_COLOR;
                ctx.beginPath();
                if (trade.isLong) {
                    // 多头平仓 → ▼
                    ctx.moveTo(blx,        bly + size);
                    ctx.lineTo(blx + size, bly - size * 0.6);
                    ctx.lineTo(blx - size, bly - size * 0.6);
                } else {
                    // 空头平仓 → ▲
                    ctx.moveTo(blx,        bly - size);
                    ctx.lineTo(blx + size, bly + size * 0.6);
                    ctx.lineTo(blx - size, bly + size * 0.6);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                // ── 检测 hover（用媒体坐标比较） ─────────────────────────
                if (mouse) {
                    const distEntry = Math.hypot(mouse.x - ex, mouse.y - ey);
                    const distExit  = Math.hypot(mouse.x - lx, mouse.y - ly);
                    if (distEntry < HIT_RADIUS) {
                        tooltipTrade   = trade;
                        tooltipIsEntry = true;
                        tooltipMx      = ex;
                        tooltipMy      = ey;
                    } else if (distExit < HIT_RADIUS) {
                        tooltipTrade   = trade;
                        tooltipIsEntry = false;
                        tooltipMx      = lx;
                        tooltipMy      = ly;
                    }
                }
            });

            // ── Tooltip 气泡 ──────────────────────────────────────────────
            if (tooltipTrade) {
                const t = tooltipTrade as TradePair;
                const pnlStr  = t.pnl >= 0 ? `+${t.pnl.toFixed(2)}` : t.pnl.toFixed(2);
                const color   = t.pnl >= 0 ? WIN_COLOR : LOSS_COLOR;
                const lines   = tooltipIsEntry
                    ? [
                        `▶ Entry`,
                        `Price : ${t.entryPrice}`,
                        `PnL   : ${pnlStr}`,
                      ]
                    : [
                        `◀ Exit`,
                        `Price : ${t.exitPrice}`,
                        `PnL   : ${pnlStr}`,
                      ];
                drawTooltip(ctx, dpr, tooltipMx, tooltipMy, lines, color);
            }
        });
    }
}

// ─── PaneView ────────────────────────────────────────────────────────────────
class TradePaneView implements IPrimitivePaneView {
    private _trades:   TradePair[];
    private _param:    SeriesAttachedParameter<Time> | null = null;
    private _mousePos: MousePos | null = null;

    constructor(trades: TradePair[]) {
        this._trades = trades;
    }

    update(param: SeriesAttachedParameter<Time>) {
        this._param = param;
    }

    setMousePos(pos: MousePos | null) {
        this._mousePos = pos;
    }

    renderer(): IPrimitivePaneRenderer {
        return new TradeRenderer(this._trades, this._param, this._mousePos);
    }
}

// ─── Primitive（对外暴露） ────────────────────────────────────────────────────
export class TradeArrowPrimitive implements ISeriesPrimitive<Time> {
    private _paneView: TradePaneView;
    private _param:    SeriesAttachedParameter<Time> | null = null;
    private _handler:  ((p: MouseEventParams<Time>) => void) | null = null;

    constructor(trades: TradePair[]) {
        this._paneView = new TradePaneView(trades);
    }

    attached(param: SeriesAttachedParameter<Time>) {
        this._param = param;
        this._paneView.update(param);

        // 订阅 crosshair 移动，更新鼠标位置并触发重绘
        this._handler = (p: MouseEventParams<Time>) => {
            if (p.point) {
                this._paneView.setMousePos({ x: p.point.x, y: p.point.y });
            } else {
                this._paneView.setMousePos(null);
            }
            param.requestUpdate();
        };
        param.chart.subscribeCrosshairMove(this._handler);
    }

    detached() {
        if (this._param && this._handler) {
            this._param.chart.unsubscribeCrosshairMove(this._handler);
        }
        this._param  = null;
        this._handler = null;
    }

    paneViews(): readonly IPrimitivePaneView[] {
        return [this._paneView];
    }
}
