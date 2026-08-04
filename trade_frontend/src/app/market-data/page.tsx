import { redirect } from "next/navigation";
import { MARKET_DATA_ROUTES } from "@/data/router";

export default function Home()
{
    redirect(MARKET_DATA_ROUTES.MarketData_Analysis.herf);
}