"use client"

import { TradeData } from "../data/TradeData";
import { StatisticsReturnOfDistribution,TradeDorData } from "../data/TradeData";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RadialBarChart, RadialBar } from 'recharts';
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
    let TradeDorData:TradeDorData[] = StatisticsReturnOfDistribution(TradeDatas,100);

    return (
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
      <XAxis dataKey="name" />
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
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Percent" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
          <RechartsDevtools />
        </BarChart>
      </div>

    </div>
  );
}