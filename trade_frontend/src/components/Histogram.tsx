import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { TradeData } from '@/data/tradeData';

import { StatisticsDailyTradeData } from '../data/tradeData';

export default function Histogram(
     {
        TradeRecords,
        ShowRule
    }:
    {
        TradeRecords:TradeData[],
        ShowRule?:boolean
    }
) {
    

let DailyData = StatisticsDailyTradeData(TradeRecords);

    let min:number = 1000000
    let max:number = -999999
    DailyData.forEach(item =>
    {
      min = item.EquityCurve < min ? item.EquityCurve : min
      max = item.EquityCurve > max ? item.EquityCurve : max
    }
    );

    min *= 0.9
    max *= 1.1
    min = Math.trunc(min)
    max =Math.trunc(max)
    console.log("dddddddddddddddddd")
    console.log(max)
    console.log(min)
  
  return (
 <div className='flex w-full '>

    <div className='flex-1'>
        <h2>Trade Equity Curve</h2>
    <LineChart style={{ width: '100%', aspectRatio: 1.618 }} responsive data={TradeRecords}>
      <CartesianGrid />
      <Line dataKey="EquityCurve" />
      <XAxis dataKey="Order" />
      <Tooltip/>
      <YAxis />
      <Legend />
      <RechartsDevtools />
    </LineChart>
    </div>

    <div  className='flex-1'>
        <h2>Daily Equity Curve</h2>
    <LineChart style={{ width: '100%', aspectRatio: 1.618 }} responsive data={DailyData}>
      <CartesianGrid />
      {ShowRule && <Line dataKey="TargetEquity" stroke='blue'/>}
      <Line dataKey="EquityCurve" stroke='green'/>
      {ShowRule&&<Line dataKey="MinalEuqity" stroke='red'/>}
      <XAxis dataKey="Date" />
      <YAxis domain={[min,max]} tickCount={10}/>
      <Tooltip/>

      <Legend />
      <RechartsDevtools />
    </LineChart>
    </div>

    <div  className='flex-1'>
        <h2>Daily Pnl Curve</h2>
    <LineChart style={{ width: '100%', aspectRatio: 1.618 }} responsive data={DailyData}>
      <CartesianGrid />
      <Line dataKey="Pnl" />
      <XAxis dataKey="Date" />
      <YAxis />
      <Tooltip/>

      <Legend />
      <RechartsDevtools />
    </LineChart>
    </div>



    </div>
  );
}