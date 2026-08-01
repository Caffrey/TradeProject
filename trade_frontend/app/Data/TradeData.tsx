
interface FilterData {
    StartDate: string;
    EndDate: string;
    Symbol: string;
}

export class DailyTradeData {
    Date: string = "";
    Pnl: number = 0;
    EquityCurve: number = 0;
}

export interface TradeData {
    ID: number;
    OpenTime: string;
    CloseTime: string;
    Lot: number;
    Tick: number;
    Pnl: number;
    Symbol: string;
    SourceSymbol: string;
    EquityCurve: number;
    Order: number;
}

export class TradeDorData {
    StartBin: number = 0;
    EndBin: number = 0;
    name: string = "";
    Percent: string = "";
    Value: number = 0;
    Pnl : number = 0;
    TotalPercent : string = ""
}

export class TradeStatisticsData {
    ProfitFactor: number = 0;
    TradeCount: number = 0;

    TotalProfit: number = 0;
    TotalLost: number = 0;

    WinRate: number = 0;
    WinCount: number = 0;
    LostCount: number = 0;

    AverageWin: number = 0;
    AverageLost: number = 0;

    MaxDrawback: number = 0;
    MaxDrawbackRate: number = 0;
    HistoryPeak: number = 0;
    HistoryLow: number = 0;
}

export function StatisticsDailyTradeData(TradeDatas: TradeData[]) {
    const dailyMap = new Map<string, DailyTradeData>();

    TradeDatas.forEach(item => {
        const day = item.OpenTime.substring(0, 10);
        let daily = dailyMap.get(day);

        if (!daily) {
            daily = new DailyTradeData();

            daily.Date = day;

            dailyMap.set(day, daily);
        }

        daily.Pnl += item.Pnl;
    }
    );

    let result = Array.from(dailyMap.values());
    result.sort((a, b) => {
        return new Date(a.Date).getTime()
            - new Date(b.Date).getTime();
    });

    let pnl = 0;
    result.forEach(item => {
        pnl += item.Pnl;
        item.EquityCurve = pnl;
    });

    return result;
}

export function SperadWinLostTradeRecords(TradeDatas: TradeData[], bin: number = 20)
{

    let WinTradeDatas: TradeData[] = []
    let LostTradeDatas: TradeData[] = []
    

    TradeDatas.forEach((item: TradeData) => {
            if(item.Pnl > 0)
            {
                WinTradeDatas.push(item)
            }
            else
            {
                LostTradeDatas.push(item)
            }
        });

        return [WinTradeDatas,LostTradeDatas]
}

export function StatisticsReturnOfDistribution(TradeDatas: TradeData[], bin: number = 20, MaxPnl: number) {

    let MaxTick: number = 0;
    let MinTick: number = 0;
    let TotalTrade: number = 0;
    let BinDatas: TradeDorData[] = [];

    TradeDatas.forEach((item: TradeData) => {
        MaxTick = item.Tick > MaxTick ? item.Tick : MaxTick;
        MinTick = item.Tick < MinTick ? item.Tick : MinTick;
        TotalTrade += 1;
    });

    for (let min = MinTick; min < MaxTick; min += bin) {

        let data = new TradeDorData();
        data.StartBin = min;
        data.EndBin = min + bin;
        data.name = `${min}-${min + bin}`;
        BinDatas.push(data);
    }
    if(BinDatas.length > 0)
        BinDatas[BinDatas.length-1].EndBin += 1

    TradeDatas.forEach((item: TradeData) => {

        let BinData = BinDatas.find(
            x => x.StartBin <= item.Tick && x.EndBin > item.Tick
        )
        if (BinData == undefined)
            throw new Error(`找不到Bin值${ item.Tick}-  ${MaxTick}`);

        BinData.Value += 1;
        BinData.Percent = (BinData.Value / TotalTrade).toFixed(2);
        BinData.Pnl += item.Pnl;
        BinData.TotalPercent = Math.abs( BinData.Pnl/MaxPnl).toFixed(2);
    });

    if (MaxPnl < 0) {
        BinDatas.sort(
            (a, b) => b.StartBin - a.StartBin
        )
    }
    
    return BinDatas.filter( t=> t.Pnl != 0);

}

export function PreProcessTradeData(TradeDatas: TradeData[]) {
    let EquityCurve: number = 0;
    console.log(TradeDatas)
    let Order = 1;
    TradeDatas.forEach((item: TradeData) => {
        EquityCurve += item.Pnl;
        item.EquityCurve = EquityCurve;
        item.Order = Order;
        Order++;
    });
}


export function StatisticsTradeData(TradeDatas: TradeData[]) {
    let StatisticsData: TradeStatisticsData = new TradeStatisticsData();

    let EquityCurve: number = 0;
    let HistoryHigh: number = 0;

    TradeDatas.forEach((item: TradeData) => {

        EquityCurve += item.Pnl;

        StatisticsData.HistoryPeak = StatisticsData.HistoryPeak < EquityCurve ? EquityCurve : StatisticsData.HistoryPeak;
        StatisticsData.HistoryLow = StatisticsData.HistoryLow > EquityCurve ? EquityCurve : StatisticsData.HistoryLow;

        let DrawDown: number = StatisticsData.HistoryPeak - EquityCurve;
        if (DrawDown > StatisticsData.MaxDrawback) {
            StatisticsData.MaxDrawback = DrawDown;
        }


        if (item.Tick > 0) {
            StatisticsData.WinCount += 1;
            StatisticsData.TotalProfit += item.Pnl;
        }
        else {
            StatisticsData.LostCount += 1;
            StatisticsData.TotalLost += Math.abs(item.Pnl);
        }

        StatisticsData.TradeCount += 1;

    });
    StatisticsData.WinRate = StatisticsData.WinCount / StatisticsData.TradeCount;
    StatisticsData.ProfitFactor = StatisticsData.TotalProfit / StatisticsData.TotalLost;
    StatisticsData.AverageWin = StatisticsData.TotalProfit / StatisticsData.WinCount;
    StatisticsData.AverageLost = StatisticsData.TotalLost / StatisticsData.LostCount;
    StatisticsData.MaxDrawbackRate = StatisticsData.HistoryPeak / StatisticsData.MaxDrawback;

    StatisticsData.WinRate.toFixed(2);

    return StatisticsData;

}