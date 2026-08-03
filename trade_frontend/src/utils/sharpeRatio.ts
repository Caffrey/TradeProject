/**
 * 夏普比率 (Sharpe Ratio) 计算工具
 *
 * 夏普比率 = (投资组合收益率 - 无风险利率) / 投资组合收益率的标准差
 *
 * 公式: Sharpe = (Rp - Rf) / σp
 *   - Rp: 投资组合期望收益率
 *   - Rf: 无风险利率
 *   - σp: 投资组合收益率的标准差
 */

// ─────────────────────────────────────────────
// 基础统计工具
// ─────────────────────────────────────────────

/**
 * 计算均值
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * 计算标准差
 * @param values  数值数组
 * @param ddof    自由度校正: 0 = 总体标准差, 1 = 样本标准差 (默认 1)
 */
export function stdDev(values: number[], ddof: 0 | 1 = 1): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) /
    (values.length - ddof);
  return Math.sqrt(variance);
}

// ─────────────────────────────────────────────
// 收益率计算
// ─────────────────────────────────────────────

/**
 * 由价格序列计算简单收益率数组
 * returnRate[i] = (price[i+1] - price[i]) / price[i]
 */
export function simpleReturns(prices: number[]): number[] {
  if (prices.length < 2) return [];
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

/**
 * 由价格序列计算对数收益率数组
 * logReturn[i] = ln(price[i+1] / price[i])
 */
export function logReturns(prices: number[]): number[] {
  if (prices.length < 2) return [];
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }
  return returns;
}

// ─────────────────────────────────────────────
// 夏普比率核心计算
// ─────────────────────────────────────────────

export interface SharpeOptions {
  /**
   * 无风险利率 (与收益率同周期)
   * 例如：若收益率为日收益率，传入日无风险利率 = 年化利率 / 252
   * 默认值: 0
   */
  riskFreeRate?: number;

  /**
   * 年化因子（每年的周期数），用于将夏普比率年化
   * - 日度数据:  252
   * - 周度数据:   52
   * - 月度数据:   12
   * - 不年化:      1 (默认)
   */
  annualizationFactor?: number;

  /**
   * 标准差自由度校正: 0 = 总体, 1 = 样本 (默认 1)
   */
  ddof?: 0 | 1;
}

/**
 * 计算夏普比率
 *
 * @param returns  收益率数组（每期收益率，例如每日收益率）
 * @param options  可选参数
 * @returns        夏普比率（已根据 annualizationFactor 年化）
 *
 * @example
 * // 月度收益率，年化
 * const monthly = [0.02, -0.01, 0.03, 0.015, -0.005, 0.025];
 * const sharpe = calculateSharpeRatio(monthly, {
 *   riskFreeRate: 0.02 / 12,   // 年化 2% 转月
 *   annualizationFactor: 12,
 * });
 */
export function calculateSharpeRatio(
  returns: number[],
  options: SharpeOptions = {}
): number {
  const { riskFreeRate = 0, annualizationFactor = 1, ddof = 1 } = options;

  if (returns.length < 2) {
    throw new Error("至少需要 2 个收益率数据点才能计算夏普比率");
  }

  const excessReturns = returns.map((r) => r - riskFreeRate);
  const avgExcess = mean(excessReturns);
  const sigma = stdDev(excessReturns, ddof);

  if (sigma === 0) {
    throw new Error("收益率标准差为 0，无法计算夏普比率");
  }

  const sharpe = (avgExcess / sigma) * Math.sqrt(annualizationFactor);
  return sharpe;
}

/**
 * 由价格序列直接计算夏普比率（使用简单收益率）
 *
 * @param prices   价格序列（时间升序）
 * @param options  可选参数
 */
export function sharpeFromPrices(
  prices: number[],
  options: SharpeOptions = {}
): number {
  const returns = simpleReturns(prices);
  return calculateSharpeRatio(returns, options);
}

// ─────────────────────────────────────────────
// 扩展指标：索提诺比率 & 卡尔玛比率
// ─────────────────────────────────────────────

/**
 * 索提诺比率 (Sortino Ratio)
 * 只惩罚下行波动，而非总波动
 *
 * Sortino = (Rp - Rf) / σ_down
 */
export function calculateSortinoRatio(
  returns: number[],
  options: SharpeOptions = {}
): number {
  const { riskFreeRate = 0, annualizationFactor = 1, ddof = 1 } = options;

  if (returns.length < 2) {
    throw new Error("至少需要 2 个收益率数据点才能计算索提诺比率");
  }

  const excessReturns = returns.map((r) => r - riskFreeRate);
  const avgExcess = mean(excessReturns);

  // 只取负超额收益计算下行标准差
  const downside = excessReturns.filter((r) => r < 0);
  if (downside.length === 0) {
    return Infinity; // 没有负收益，索提诺比率理论上无穷大
  }

  const downsideVariance =
    downside.reduce((sum, r) => sum + r * r, 0) / (downside.length - ddof);
  const downsideSigma = Math.sqrt(downsideVariance);

  if (downsideSigma === 0) {
    return Infinity;
  }

  return (avgExcess / downsideSigma) * Math.sqrt(annualizationFactor);
}

/**
 * 计算最大回撤 (Maximum Drawdown)
 * 用于辅助卡尔玛比率计算
 *
 * @returns 最大回撤（正数，例如 0.2 表示 20% 回撤）
 */
export function maxDrawdown(prices: number[]): number {
  if (prices.length < 2) return 0;
  let peak = prices[0];
  let maxDD = 0;
  for (const price of prices) {
    if (price > peak) peak = price;
    const dd = (peak - price) / peak;
    if (dd > maxDD) maxDD = dd;
  }
  return maxDD;
}

/**
 * 卡尔玛比率 (Calmar Ratio)
 * 年化收益率 / 最大回撤
 *
 * @param prices              价格序列（时间升序）
 * @param annualizationFactor 年化因子（默认 252，日度数据）
 */
export function calculateCalmarRatio(
  prices: number[],
  annualizationFactor = 252
): number {
  if (prices.length < 2) {
    throw new Error("至少需要 2 个价格数据点才能计算卡尔玛比率");
  }

  const returns = simpleReturns(prices);
  const annualizedReturn = mean(returns) * annualizationFactor;
  const mdd = maxDrawdown(prices);

  if (mdd === 0) {
    return Infinity;
  }

  return annualizedReturn / mdd;
}

// ─────────────────────────────────────────────
// 综合报告
// ─────────────────────────────────────────────

export interface RiskMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  annualizedReturn: number;
  annualizedVolatility: number;
  maxDrawdown: number;
  meanReturn: number;
  stdReturn: number;
  totalReturn: number;
  numberOfPeriods: number;
}

/**
 * 计算完整的风险调整收益指标
 *
 * @param prices              价格序列（时间升序）
 * @param riskFreeRate        同周期无风险利率（默认 0）
 * @param annualizationFactor 年化因子（默认 252）
 */
export function calculateRiskMetrics(
  prices: number[],
  riskFreeRate = 0,
  annualizationFactor = 252
): RiskMetrics {
  if (prices.length < 2) {
    throw new Error("至少需要 2 个价格数据点");
  }

  const returns = simpleReturns(prices);
  const opts: SharpeOptions = { riskFreeRate, annualizationFactor };

  const meanRet = mean(returns);
  const stdRet = stdDev(returns);
  const annualizedReturn = meanRet * annualizationFactor;
  const annualizedVolatility = stdRet * Math.sqrt(annualizationFactor);
  const totalReturn = (prices[prices.length - 1] - prices[0]) / prices[0];
  const mdd = maxDrawdown(prices);

  let sharpeRatio: number;
  let sortinoRatio: number;
  let calmarRatio: number;

  try {
    sharpeRatio = calculateSharpeRatio(returns, opts);
  } catch {
    sharpeRatio = NaN;
  }

  try {
    sortinoRatio = calculateSortinoRatio(returns, opts);
  } catch {
    sortinoRatio = NaN;
  }

  try {
    calmarRatio = calculateCalmarRatio(prices, annualizationFactor);
  } catch {
    calmarRatio = NaN;
  }

  return {
    sharpeRatio,
    sortinoRatio,
    calmarRatio,
    annualizedReturn,
    annualizedVolatility,
    maxDrawdown: mdd,
    meanReturn: meanRet,
    stdReturn: stdRet,
    totalReturn,
    numberOfPeriods: returns.length,
  };
}

// ─────────────────────────────────────────────
// 逐笔交易夏普比率 (Trade Sharpe Ratio)
// ─────────────────────────────────────────────

/**
 * 逐笔交易夏普比率 (Trade Sharpe Ratio)
 *
 * 专为逐笔交易 PnL 序列设计。
 * 传统夏普比率基于"价格→收益率"，需要非零的价格基准，
 * 而交易 PnL 序列从 0 开始累加，不适合直接用 sharpeFromPrices。
 *
 * 此函数直接以每笔 PnL 作为"收益"计算夏普比率：
 *   TradeSharpe = mean(PnL) / stdDev(PnL) * sqrt(annualizationFactor)
 *
 * @param pnlArr              每笔交易的 PnL 数组，例如 [50, -30, 120, -20, ...]
 * @param annualizationFactor 年化因子（默认 1，不年化）
 *                            若已知每年平均交易次数，可传入该值进行年化
 * @param riskFreeRate        每笔交易的无风险基准收益（通常为 0）
 *
 * @returns Trade Sharpe Ratio
 *
 * @example
 * // 逐笔交易 PnL
 * const pnls = [50, -30, 120, -20, 80, -10, 60];
 * const tradeSharpe = calculateTradeSharpe(pnls);
 *
 * // 若每年约交易 250 笔，年化
 * const annualized = calculateTradeSharpe(pnls, 250);
 */
export function calculateTradeSharpe(
  pnlArr: number[],
  annualizationFactor = 1,
  riskFreeRate = 0
): number {
  if (pnlArr.length < 2) {
    throw new Error("至少需要 2 笔交易数据才能计算 Trade Sharpe Ratio");
  }

  const excessPnl = pnlArr.map((p) => p - riskFreeRate);
  const avgPnl = mean(excessPnl);
  const sigma = stdDev(excessPnl, 1);

  if (sigma === 0) {
    throw new Error("PnL 标准差为 0，无法计算 Trade Sharpe Ratio");
  }

  return (avgPnl / sigma) * Math.sqrt(annualizationFactor);
}
