
import Histogram from "./Histogram";


export default async function TradeAnalysisPanel
(
       {
        StartDate,
        EndDate,
        SymbolName
    }:{
        StartDate?:string,
        EndDate?:string,
        SymbolName?:string
    }
)
{

     let trades = [];

     if(StartDate && EndDate && SymbolName)
     {

         const params = new URLSearchParams({
             StartDate,
            EndDate,
            SymbolName
         });

          const res = await fetch(
            `http://localhost:8000/GetTradeData?${params.toString()}`,
            {
                cache:"no-store"
            }
        );

        trades = await res.json();
        console.log(trades)
     }

    return(

        <div>
            <h2>
                Trade Result
            </h2>

            {
           trades.map((trade:any)=>(
                    <div>
                        {trade.Symbol}
                    </div>
                ))
            }
        </div>
    );
}