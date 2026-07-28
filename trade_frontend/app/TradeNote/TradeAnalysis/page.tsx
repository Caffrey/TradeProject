
import TradeAnalysisPanel from "@/app/components/TradeAnalysisPanel";
import TradeHisotryFilter from "@/app/components/TradeHisotryFilter";

export default async function TradeAnalysis(
    {
        searchParams
    }:{
         searchParams: Promise<{
        StartDate?: string,
        EndDate?: string,
        SymbolName?: string
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
                SymbolName={params.SymbolName}
            />
            </div>
        </div>

    );
}