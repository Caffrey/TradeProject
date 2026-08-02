import { redirect } from "next/navigation";
import { TRADE_ROUTES } from "@/data/router";

export default function Home()
{
    redirect(TRADE_ROUTES.TradeNote_MontlyTradeAnalysis.herf);
}