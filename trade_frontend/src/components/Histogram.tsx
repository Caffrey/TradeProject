import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { TradeData } from '@/data/tradeData';

import { DailyTradeData } from '@/data/tradeData';
import { StatisticsDailyTradeData } from '../data/tradeData';

import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE


interface SummaryDate
{
  startDate:Date,
  endDate:Date,
  pnl : number;
  trades : number
}

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
let DailyData = StatisticsDailyTradeData(TradeRecords,startMoney);

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
  
  
  const [currentMonth, setCurrentMonth] = useState<SummaryDate>({
      startDate: new Date(),
      endDate: new Date(),
      pnl: 0,
      trades: 0
  })
const [currentMonthWeeks, setCurrentMonthWeeks] = useState<SummaryDate[]>([])

  function GetPnlWithRange(
    DailyTradeDatas: DailyTradeData[],
    startDate: Date,
    endDate: Date
) {
    let pnl = 0
    let trades = 0

    DailyTradeDatas.forEach((item) => {

        const date = new Date(item.Date)

        if (date >= startDate && date <= endDate) {
            pnl += item.Pnl
            trades += item.Trades
        }
    })

    return {
        pnl,
        trades
    }
}

 function UpdateSummary(
    DailyTradeDatas: DailyTradeData[],
    startDate: Date,
    endDate: Date
) {
    // 月
    const monthData = GetPnlWithRange(
        DailyTradeDatas,
        startDate,
        endDate
    )
    setCurrentMonth({
        startDate: startDate,
        endDate: endDate,
        pnl: monthData.pnl,
        trades: monthData.trades
    })


    // 周
    const weeks: SummaryDate[] = []

    let weekStart = new Date(startDate)

    // 当前月第一天是星期几
    const day = weekStart.getDay()

    // 调整到星期一
    const diff = day === 0 ? -6 : 1 - day

    weekStart.setDate(
        weekStart.getDate() + diff
    )

    while (weekStart <= endDate) {

        const weekEnd = new Date(weekStart)

        weekEnd.setDate(
            weekEnd.getDate() + 6
        )

        // 限制在当前月份
        const actualStart =
            weekStart < startDate
                ? new Date(startDate)
                : new Date(weekStart)

        const actualEnd =
            weekEnd > endDate
                ? new Date(endDate)
                : new Date(weekEnd)

        const weekData = GetPnlWithRange(
            DailyTradeDatas,
            actualStart,
            actualEnd
        )

     
            weeks.push({
                startDate: actualStart,
                endDate: actualEnd,
                pnl: weekData.pnl,
                trades: weekData.trades
            })

        weekStart.setDate(
            weekStart.getDate() + 7
        )
    }

    setCurrentMonthWeeks(weeks)
}



  return (
    <div>
      <div className='flex w-full '>
        {/* // */}
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
        {/* // */}
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
        {/* // */}
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


    {/* // */}
    <div className='flex w-full '>
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
              datesSet={(arg) => {
                UpdateSummary(
                    DailyData,
                    arg.view.currentStart,
                    arg.view.currentEnd
                )
    }}
              events={DailyEvents}
              eventContent={(arg)=>
              {
                  return(
                  <div >
                    <div> Tra : {arg.event.extendedProps.Trades}</div>
                    <div > Pnl : {arg.event.extendedProps.Pnl.toFixed(0)} </div>
                    
                  </div>);
              }}
            />
        </div>
        <div className='flex-1'>
          <h1>month trades ${currentMonth.trades}</h1>
          <h1 className={   currentMonth.pnl >= 0  ? "text-green-600"  : "text-red-600" }
            >
            month pnl ${currentMonth.pnl}</h1>
            <h1>Weeks</h1>
            {currentMonthWeeks.map((item, index) => {
                  if (item.trades <= 0) {
                      return null;
                  }

                  return (
                      <div key={index}>
                          <h1>第{index + 1}周</h1>

                          <h1>
                              Trades: {item.trades}
                          </h1>

                          <h1
                              className={
                                  item.pnl >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                              }
                          >
                              PNL: ${item.pnl.toFixed(0)}
                          </h1>
                      </div>
                  );
              })}
        </div>
    </div>

    </div>
  );
}