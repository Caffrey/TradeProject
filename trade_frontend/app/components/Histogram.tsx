import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { TradeData } from '../data/TradeData';

import { StatisticsDailyTradeData } from '../data/TradeData';

export default function Histogram(
     {
        TradeRecords
    }:
    {
        TradeRecords:TradeData[] 
    }
) {
    

let DailyData = StatisticsDailyTradeData(TradeRecords);


  return (
 <div>

    //
    <div>
        <h2>Trade Equity Curve</h2>
    <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={TradeRecords}>
      <CartesianGrid />
      <Line dataKey="EquityCurve" />
      <XAxis dataKey="Order" />
      <YAxis />
      <Legend />
      <RechartsDevtools />
    </LineChart>
    </div>

    <div>
        <h2>Daily Equity Curve</h2>
    <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={DailyData}>
      <CartesianGrid />
      <Line dataKey="EquityCurve" />
      <XAxis dataKey="Date" />
      <YAxis />
      <Legend />
      <RechartsDevtools />
    </LineChart>
    </div>

    <div>
        <h2>Daily Pnl Curve</h2>
    <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={DailyData}>
      <CartesianGrid />
      <Line dataKey="Pnl" />
      <XAxis dataKey="Date" />
      <YAxis />
      <Legend />
      <RechartsDevtools />
    </LineChart>
    </div>



    </div>
  );
}