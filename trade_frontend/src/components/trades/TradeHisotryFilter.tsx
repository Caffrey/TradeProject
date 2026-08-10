"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Request_TradeValidSymbols } from "@/requests/requestTrades";
import { TRADE_ROUTES } from "@/data/router";
import { TradeFilterData } from "@/data/tradeData";

export default function TradeHisotryFilter()
{
    const router = useRouter();
    const [Symbols, setSymbols] = useState<string[]>([]);
    const [Platforms, setPlatforms] = useState<string[]>([]);
    const [Accounts, setAccounts] = useState<string[]>([]);
    const [Strategies, setStrategies] = useState<string[]>([]);

    const [TradeFilters, setTradeFilters] = useState<TradeFilterData[]>([]);

    //setup date-----------------------------------------------------------------------------------------------------------------------------------------------------------
    function formatDateTime(date: Date) 
    {
        return date.toLocaleString("sv-SE").replace(" ", "T").slice(0,16);
    }

    //----------------------------------------------------------------------------------------------------------------------------
    const now = new Date();
    const endDate = formatDateTime(now);
    const start = new Date();
    start.setHours(0)
    start.setDate(start.getDate() - 20);
    const startDate = formatDateTime(start);
    //----------------------------------------------------------------------------------------------------------------------------

    const [filter, setFilter] = useState({
        StartDate: startDate,
        EndDate: endDate,   
        Platform:"",
        Accounts:"",
        Strategies:"",
        SymbolName:"",
    });
    
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 
    //fliter platform
    useEffect(()=>{
        async function LoadData(){
            const ServerData:TradeFilterData[] = await Request_TradeValidSymbols();
            
            setTradeFilters(ServerData)


            const data = [
                ...new Set(ServerData.map(x=>x.TradeRecordType))
            ];

            setPlatforms(data);
            
            if(data.length > 0)
            {
                setFilter(prev => ({
                    ...prev,
                    Platform: data[0]
                }));
            }
        }

        LoadData();
    },[]);

    // fliter acount
    useEffect(()=>{
        if(!filter.Platform)
            return;

        const data_account:string[] = [
            ...new Set(TradeFilters.filter(x=>x.TradeRecordType === filter.Platform).map(x=> x.Acount))
        ];
        setAccounts(data_account);
        
        if(data_account.length > 0)
        {
            setFilter(prev => ({
                ...prev,
                Accounts: data_account[0]
            }));
        }
    },[TradeFilters,filter.Platform]);



    //acount -> fliter -> straegty
    useEffect(()=>{
        if(!filter.Accounts)
            return;

        const data_strategy = [
                ...new Set(TradeFilters.filter(x=>x.Acount === filter.Accounts).map(x=>x.Strategy))
            ];
        setStrategies(data_strategy);

        if(data_strategy.length > 0)
        {
            setFilter(prev=>({
                ...prev,
                Strategies:data_strategy[0]
            }));
        }
    },[TradeFilters,filter.Accounts])


    //straegty -> synbol
    useEffect(()=>{
        if(!filter.Strategies)
            return;

        const data_symbol = [
                ...new Set(TradeFilters.filter(x=>x.TradeRecordType === filter.Platform).filter(x=>x.Acount === filter.Accounts).filter(x=>x.Strategy === filter.Strategies).map(x=>x.Symbol))
            ];
        setSymbols(data_symbol);

        if(data_symbol.length > 0)
        {
            setFilter(prev=>({
                ...prev,
                SymbolName:data_symbol[0]
            }));
        }
    },[TradeFilters,filter.Accounts,filter.Strategies])
    

     function GetTradeData(e : React.FormEvent<HTMLFormElement>){

        e.preventDefault();
          const url =
        `${TRADE_ROUTES.TradeNote_TradeAnalysis.herf}?` +
        `StartDate=${filter.StartDate}&` +
        `EndDate=${filter.EndDate}&` +
        `Platfotm=${filter.Platform}&` +
        `Account=${filter.Accounts}&` +
        `Strategy=${filter.Strategies}&` +
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
                <span className="label">Platform</span>
                <select name="AcountlName" value={filter.Platform}
                    onChange={(e)=>{setFilter({...filter,Platform:e.target.value})}}
                    >
                    {Platforms.map(item =>(
                        <option value={item} key={item}>{item}</option>
                    ))}
                </select>
                </label>
            </div>

            <div>
                <label className="select">
                <span className="label">Accounts</span>
                <select name="AcountlName" value={filter.Accounts}
                    onChange={(e)=>{setFilter({...filter,Accounts:e.target.value})}}
                    >
                    {Accounts.map(item =>(
                        <option value={item} key={item}>{item}</option>
                    ))}
                </select>
                </label>
            </div>

            <div>
                <label className="select">
                <span className="label">Strategies</span>

                <select name="StrategyName" value={filter.Strategies}
                    onChange={(e)=>{setFilter({...filter,Strategies:e.target.value})}}
                    >
                    {Strategies.map(item=>(
                        <option value={item} key={item}>{item}</option>
                    ))}
                </select>
                </label>
            </div>

            <div>
                <label className="select">
                <span className="label">Symbol</span>

                <select name="SymbolName" value={filter.SymbolName}
                    onChange={(e)=>{setFilter({...filter,SymbolName:e.target.value})}}
                    >
                    {Symbols.map(item=>(
                        <option value={item} key={item}>{item}</option>
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