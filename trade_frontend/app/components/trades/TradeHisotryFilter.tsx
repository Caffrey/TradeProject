"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Request_TradeValidSymbols } from "@/requests/requestTrades";
import { TRADE_ROUTES } from "@/data/router";

export default function TradeHisotryFilter()
{
    const router = useRouter();
    const [Symbols, setSymbols] = useState<any[]>([]);

     useEffect(()=>{

        async function LoadSymbols(){
            const data = await Request_TradeValidSymbols();
            setSymbols(data);

            if(data.length > 0){
            setFilter(prev => ({
                ...prev,
                SymbolName: data[0].Symbol
            }));
        }

        }
        LoadSymbols();

    },[]);


    

   function formatDateTime(date: Date) 
    {
        return date.toLocaleString("sv-SE").replace(" ", "T").slice(0,16);
    }

    //
    const now = new Date();
    const endDate = formatDateTime(now);
    const start = new Date();
    start.setHours(0)
    start.setDate(start.getDate() - 20);
    const startDate = formatDateTime(start);
    //

    const [filter, setFilter] = useState({
        StartDate: startDate,
        EndDate: endDate,   
        SymbolName:""
    });

     function GetTradeData(e : React.FormEvent<HTMLFormElement>){

        e.preventDefault();
          const url =
        `${TRADE_ROUTES.TradeNote_TradeAnalysis.herf}?` +
        `StartDate=${filter.StartDate}&` +
        `EndDate=${filter.EndDate}&` +
        `SymbolName=${filter.SymbolName}`;

        router.push(url)
    }

    return(
        <div className="card w-96 bg-base-100 shadow-sm">
            <form onSubmit={GetTradeData}>
            
            <div>
                <label className="input">
                <span className="label">start date</span>
                <input type="datetime-local" name="StartDate" value={filter.StartDate} className="input input-bordered" 
                onChange={(e)=>{setFilter({...filter,StartDate:e.target.value})}}/>
                </label>
            </div>

            
            <div>
                <label className="input">
                <span className="label">End Date</span>
                <input type="datetime-local" name="EndDate" value={filter.EndDate}
                 onChange={(e)=>{setFilter({...filter,EndDate:e.target.value})}}/>
                </label>
            </div>

             <div>
                <label className="select">
                <span className="label">Symbol</span>

                <select name="SymbolName" value={filter.SymbolName}
                 onChange={(e)=>{setFilter({...filter,SymbolName:e.target.value})}}
                 >
                    {Symbols.map(item=>(
                        <option value={item.Symbol} key={item.Symbol}>{item.Symbol}</option>
                    ))}
                </select>
                
                </label>
            </div>

            <button type="submit"
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">ApplyFilter</button>

            </form>
        </div>
    );
}