export interface CandleSitckSeriesData {
    time:number;
    open:number;
    close:number;
    high:number;
    low:number;
}

export interface HistoryData {
    time:Date;
    open:number;
    close:number;
    high:number;
    low:number;

    ID:number;
    Open:number;
    Close:number;
    High:number;
    Low:number;
    Volume:number;
    Date:string;
    DateTime:Date;

    Symbol:string;
    TimeFrame:string;
    Market:string;
}

export function TranslateCandleToTradingviewCandle(HistoryDatas:HistoryData[])
{
    let CandleDatas:CandleSitckSeriesData[] = []
    HistoryDatas.map(item =>
        {
            let data:CandleSitckSeriesData = 
            {
                open:item.Open,
                close:item.Close,
                high:item.High,
                low:item.Low,
                time:Math.floor(item.DateTime.getTime()/1000)
            };
            CandleDatas.push(data);
        }
    );


    return CandleDatas;
}

    
