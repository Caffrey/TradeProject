import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { TradeData } from '@/data/tradeData';

import { StatisticsDailyTradeData } from '../data/tradeData';

import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE


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
    
 let startMoney = ShowRule ? 25000 : 0;
let DailyData = StatisticsDailyTradeData(TradeRecords,0);

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
    min = Math.floor(min)
    max =Math.trunc(max)
  
    const DailyEvents = DailyData.map((item) => ({
    start: item.Date,
    end:item.Date,
    allDay: true,
    Pnl: item.Pnl,
    Trades:item.Trades,
    color: item.Pnl < 0 ? "#ef4444" : "#22c55e",
  }));



  return (
 <div className='flex w-full '>

    <div className='flex-1'>
        <h2>Trade Equity Curve</h2>
    <LineChart style={{ width: '100%', aspectRatio: 1.618 }} responsive data={TradeRecords} >
      <CartesianGrid />
      <Line dataKey="EquityCurve" dot={false}/>
      <XAxis dataKey="Order" />
      
      <Tooltip
      content={({ active, payload }) => {
        if (!active || !payload || !payload.length) {
          return null;
        }

        const data = payload[0].payload;

        return (
          <div className="rounded-md bg-white p-3 shadow-lg border">
            <div>Order: {data.Order}</div>
            <div>Date: {data.OpenTime.substring(0,10)}</div>
            <div>Equity: {data.EquityCurve}</div>
          </div>
        );
      }}/>
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
      <YAxis domain={[min,max]} tickCount={10} tickFormatter={(value)=>value.toFixed(0)}/>
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

    <div className='flex-1'>
        <FullCalendar
          locale="zh-cn"
          plugins={[themePlugin, dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          events={DailyEvents}
          eventContent={(arg)=>
          {
              return(
              <div >
                <div > Pnl : {arg.event.extendedProps.Pnl.toFixed(0)} </div>
                <div> Trades : {arg.event.extendedProps.Trades}</div>
              </div>);
          }}

        />
    </div>



    </div>
  );
}