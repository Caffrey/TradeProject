import MarketDataHistoryFilter from "@/components/trading-view-charts/MarketDataHistoryFilter";
import MarketDataDisplayPanel from "@/components/trading-view-charts/MarketDataDisplayPanel";
export default async function MarketDataAnalysis(
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
                <div className=""><MarketDataHistoryFilter market="future"/> </div>
                <MarketDataDisplayPanel 
                        StartDate={params.StartDate}
                        EndDate={params.EndDate}
                        SymbolName={params.SymbolName}
                />
            </div>

    );
}