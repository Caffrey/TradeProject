import MarketDataHistoryFilter from "@/components/trading-view-charts/MarketDataHistoryFilter";

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
        </div>

    );
}