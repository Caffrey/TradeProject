
import TradeAnalysisPanel from "@/components/trades/TradeAnalysisPanel";
import TradeHisotryFilter from "@/components/trades/TradeHisotryFilter";

export default async function TradeAnalysis(
    {
        searchParams
    }:{
         searchParams: Promise<{
        StartDate?:string,
        EndDate?:string,
        Platfotm?:string,
        Account?:string,
        Strategy?:string,
        SymbolName?:string
        ShowRule?:boolean
    }>
    }
)

{
  const params = await searchParams;

    return (
        <div className="w-full">
           <div className=""><TradeHisotryFilter/> </div>
           
           <div className="">
            <TradeAnalysisPanel 
                StartDate={params.StartDate}
                EndDate={params.EndDate}
                Platfotm={params.Platfotm}
                Account={params.Account}
                Strategy={params.Strategy}
                SymbolName={params.SymbolName}
                ShowRule={params.ShowRule}
            />
            </div>
        </div>

    );
}