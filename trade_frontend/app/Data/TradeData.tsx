
interface FilterData
{
    StartDate : string;
    EndDate : string;
    Symbol : string;
}

interface TradeData
{
    OpenTime:string;
    CloseTime:string;
    Lot : number;
    Tick : number;
    Pnl : number;
    Symbol : string;
}


class ChartRowData
{
   header: string;
    value: number;

    constructor(header: string, value: number) {
        this.header = header;
        this.value = value;
    }
}

interface ChartData{
    data : ChartRowData[]
}

//
//Tick Distrubution with bin
//Equnity Curve Data
// 


function ProcessTradeData(tradeHistory :[TradeData])
{
    
    let EquityCurveData: ChartRowData[]= [];

    let sum = 0
    let id = 0
    tradeHistory.forEach(item=>
        {
            id += 1;
            sum += item.Pnl;
            EquityCurveData.push(new ChartRowData(id.toString(),sum));
        }
    );
}

