const Symbol = 
[
    {
        name:"GC"
    },
    {
        name:"NQ"
    },
    {
        name:"ES"
    }
]


export default function TradeHisotryFilter()
{
    return(
        <div className="">
             <form action="/" method="post">
                <label>start date</label>
                <input type="text"></input>

                <label>end date</label>
                <input type="text"></input>

                 <label>SymbolName</label>   
                 <select name="SymbolName">
                    {Symbol.map(item=>(
                        <option value={item.name}>{item.name}</option>
                    ))}
                 </select>
                 <input type="submit">Apply</input>

             </form>
        </div>
    );
}