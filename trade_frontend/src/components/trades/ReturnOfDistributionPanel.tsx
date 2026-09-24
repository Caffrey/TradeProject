"use client"

import { TradeStatisticsData,TradeData,StatisticsReturnOfDistribution,TradeDorData,SperadWinLostTradeRecords,StatisticsTradeData, StatisticsTimeReturnOfDistribution} from "../../data/tradeData";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const style = {
  top: '50%',
  right: 0,
  transform: 'translate(0, -50%)',
  lineHeight: '24px',
};


export default function ReturnOfDistributionPanel(
    {
        TradeDatas 
    }:
    {
        TradeDatas : TradeData[]
    }
)
{   
    let Statistics:TradeStatisticsData = StatisticsTradeData(TradeDatas)
    let bin:number = 50
    let TradeDorData:TradeDorData[] = StatisticsReturnOfDistribution(TradeDatas,bin,0);
    let TradeArray = SperadWinLostTradeRecords(TradeDatas,bin);

    let TimeDorData = StatisticsTimeReturnOfDistribution(TradeDatas);

    let WinDor:TradeDorData[] = StatisticsReturnOfDistribution(TradeArray[0],bin,Statistics.TotalProfit);
    let LostDor:TradeDorData[] = StatisticsReturnOfDistribution(TradeArray[1],bin,-Statistics.TotalLost);
    

    return (
    <div>

      <div className="flex w-full">

      <div className="flex-1">
          <h2>Tick Distribution</h2>
          <BarChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={TradeDorData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"  type="category"/>
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <Bar dataKey="Value" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
        <RechartsDevtools />
      </BarChart>
      </div>

        <div className="flex-1">
          <h2>Tick Distribution Percent</h2>
          <BarChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={TradeDorData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"  type="category"/>
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Percent" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
            <RechartsDevtools />
          </BarChart>
        </div>

        <div className="flex-1">
          <h2>Win Distribution </h2>
          <BarChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={WinDor}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"  type="category"/>
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar dataKey="TotalPercent" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
            <RechartsDevtools />
          </BarChart>
        </div>

        <div className="flex-1">
          <h2>Lost Distribution </h2>
          <BarChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={LostDor}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category"/>
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar dataKey="TotalPercent" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
            <RechartsDevtools />
          </BarChart>
        </div>

      </div>

      <div className="flex w-full">
           <div className="flex-1">
          <h2>sum time Distribution </h2>
          <BarChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={TimeDorData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" type="category"/>
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar dataKey="pnl" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
            <RechartsDevtools />
          </BarChart>
        </div>

         <div className="flex-1">
          <h2>time profit Distribution </h2>
          <BarChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={TimeDorData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" type="category"/>
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
            <RechartsDevtools />
          </BarChart>
        </div>

         <div className="flex-1">
          <h2>time lost Distribution </h2>
          <BarChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={TimeDorData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" type="category"/>
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar dataKey="lost" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
            <RechartsDevtools />
          </BarChart>
        </div>

        
      </div>
  </div>    
  );
}