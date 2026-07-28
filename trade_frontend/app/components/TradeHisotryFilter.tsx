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

   function formatDateTime(date: Date) {
    return date.toLocaleString("sv-SE").replace(" ", "T").slice(0,16);
    }

    const now = new Date();

    const endDate = formatDateTime(now);


    const start = new Date();
    start.setDate(start.getDate() - 30);

    const startDate = formatDateTime(start);


    return(
        <div className="card w-96 bg-base-100 shadow-sm">
            <form onSubmit={GetTradeData}>
            
            <div>
                <label className="input">
                <span className="label">start date</span>
                <input type="datetime-local" name="StartDate" defaultValue={startDate} className="input input-bordered"/>
                </label>
            </div>

            
            <div>
                <label className="input">
                <span className="label">End Date</span>
                <input type="datetime-local" name="EndDate" defaultValue={endDate}/>
                </label>
            </div>

             <div>
                <label className="select">
                <span className="label">Symbol</span>

                <select name="SymbolName">
                    {Symbol.map(item=>(
                        <option value={item.name} key={item.name}>{item.name}</option>
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