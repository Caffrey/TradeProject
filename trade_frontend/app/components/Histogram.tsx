"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
const Data = [
    {
        range:"-30,-10",
        count : 20
    },
     {
        range:"0-10",
        count : 23
    },
     {
        range:"12-30",
        count : 3
    },
     {
        range:"0-10",
        count : 4
    },
]

// Summary
// 胜率：Win单Lost单
// 平均盈利
//Profit Factor：+总盈利+总亏损
//期望值
//夏普值
const Histogram = () => {
  return (
    <BarChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={Data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="range" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
      <RechartsDevtools />
    </BarChart>
  );
};

export default Histogram;