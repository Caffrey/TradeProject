import Link from "next/link";
import { TRADE_ROUTES } from "@/data/router";

export default function Menu()
{
    return(
        <div className="">
                {Object.values(TRADE_ROUTES).map(item=>(
                    <div className="" key={item.label}>
                        <Link href={item.herf}>
                            <span>{item.label}</span>
                        </Link>
                    </div>
                ))}
        </div>

    );
}