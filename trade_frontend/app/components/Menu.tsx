import Link from "next/link";

const MenuItems = [
    {
        label:"Montly Trade Analysis",
        herf :"/TradeNote/MonthTradeAnalysis"
    },
    {
        label:"Trade Analysis",
        herf :"/TradeNote/TradeAnalysis"
    }
    
];


export default function Menu()
{
    return(
        <div className="">
                {MenuItems.map(item=>(
                    <div className="" key={item.label}>
                        <Link href={item.herf}>
                            <span>{item.label}</span>
                        </Link>
                    </div>
                ))}
        </div>

    );
}