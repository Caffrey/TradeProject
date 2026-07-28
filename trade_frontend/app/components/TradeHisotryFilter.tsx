"use client";

import { useRouter } from "next/navigation";

const Symbol = [
    { name:"GC" },
    { name:"NQ" },
    { name:"ES" },
    { name:"MNQ" }
];


export default function TradeHisotryFilter()
{
    const router = useRouter();

     function GetTradeData(e : React.FormEvent<HTMLFormElement>){

        const formData = new FormData(e.currentTarget);

        const StartDate = formData.get("StartDate");
        const EndDate = formData.get("EndDate");
        const SymbolName = formData.get("SymbolName");

          const url =
        `/TradeNote/TradeAnalysis?` +
        `StartDate=${StartDate}&` +
        `EndDate=${EndDate}&` +
        `SymbolName=${SymbolName}`;

        router.push(url)
    }


    return(
            <form onSubmit={GetTradeData}>
            {/*  */}
            <label>start date</label>
            <input type="datetime-local" name="StartDate"/>
            {/*  */}
            <label>end date</label>
            <input type="datetime-local" name="EndDate"/>

            {/*  */}
                <label>SymbolName</label>   
                <select name="SymbolName">
                {Symbol.map(item=>(
                    <option value={item.name} key={item.name}>{item.name}</option>
                ))}
                </select>

                {/*  */}
                <button type="submit">ApplyFilter2</button>

            </form>
    );
}