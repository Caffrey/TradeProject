import Link from "next/link";
import { MARKET_DATA_ROUTES } from "@/data/router";

export default function MarketDataMenu()
{
    return(
        <div className="">
                {Object.values(MARKET_DATA_ROUTES).map(item=>(
                    <div className="" key={item.label}>
                        <Link href={item.herf}>
                            <span>{item.label}</span>
                        </Link>
                    </div>
                ))}
        </div>

    );
}