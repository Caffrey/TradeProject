"use client"

import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis,Tooltip,TooltipContentProps ,TooltipIndex} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { Content } from 'next/font/google';

const data2 = [{id:1,
value:-280,},
{id:2,
value:-1015,},
{id:3,
value:-100,},
{id:4,
value:-185,},
{id:5,
value:-200,},
{id:6,
value:-355,},
{id:7,
value:-100,},
{id:8,
value:-305,},
{id:9,
value:-230,},
{id:10,
value:-35,},
{id:11,
value:530,},
{id:12,
value:-390,},
{id:13,
value:-220,},
{id:14,
value:-1290,},
{id:15,
value:-840,},
{id:16,
value:1655,},
{id:17,
value:415,},
{id:18,
value:-250,},
{id:19,
value:1375,},
{id:20,
value:-125,},
{id:21,
value:170,},
{id:22,
value:-275,},
{id:23,
value:1380,},
{id:24,
value:-150,},
{id:25,
value:-315,},
{id:26,
value:-930,},
{id:27,
value:15,},
{id:28,
value:-65,},
{id:29,
value:-90,},
{id:30,
value:-205,},
{id:31,
value:-185,},
{id:32,
value:25,},
{id:33,
value:0,},
{id:34,
value:-320,},
{id:35,
value:50,},
{id:36,
value:-285,},
{id:37,
value:-105,},
{id:38,
value:-350,},
{id:39,
value:-55,},
{id:40,
value:15,},
{id:41,
value:5,},
{id:42,
value:-160,},
{id:43,
value:995,},
{id:44,
value:110,},
{id:45,
value:-135,},
{id:46,
value:195,},
{id:47,
value:-850,},
{id:48,
value:990,},
{id:49,
value:-330,},
{id:50,
value:-495,},
{id:51,
value:-520,},
{id:52,
value:805,},
{id:53,
value:-30,},
{id:54,
value:700,},
{id:55,
value:15,},
{id:56,
value:20,},
{id:57,
value:-405,},
{id:58,
value:-275,},
{id:59,
value:-60,},
{id:60,
value:-385,},
{id:61,
value:-245,},
{id:62,
value:1735,},
{id:63,
value:110,},
]

// #region Sample data
const data = [
  {
    name: 'Page A',
    uv: 400,
  },
  {
    name: 'Page B',
    uv: 300,
  },
  {
    name: 'Page C',
    uv: 320,
  },
  {
    name: 'Page D',
    uv: 200,
  },
  {
    name: 'Page E',
    uv: 278,
  },
  {
    name: 'Page F',
    uv: 189,
  },
];


const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  const firstPayload = payload?.[0];
  const isVisible = active && firstPayload != null;
  const originData = firstPayload?.payload; 

  return (
    <div className="custom-tooltip border" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
      {isVisible && (
        <>
          <p className="label">{`id : ${originData.id}`}</p>
          <p className="label">{`sum : ${originData.value}`}</p>
          <p className="label">{`value : ${originData.trade}`}</p>
        </>
      )}
    </div>
  );
};

// #endregion
export default function MonthTradeAnalysis() {

  let data3:any = []
  let sum = 0
  data2.forEach(item =>
    {
      sum += item.value;
      data3.push(
        {
          "id":item.id,
          "value":sum,
          "trade":item.value
        }
      );
    }
  );

  return (
    <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={data3}>
      <CartesianGrid />
      <Line dataKey="value" />
      <XAxis dataKey="id" />
      <YAxis />
      <Tooltip
        cursor={{
          stroke: 'var(--color-border-2)',
        }}
        contentStyle={{
          backgroundColor: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border-2)',
        }
        }
        content={CustomTooltip}
      />
      <Legend />
      <RechartsDevtools />
    </LineChart>
  );
}