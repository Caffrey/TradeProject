import Link from "next/link";

const MenuItems = [
    {
        label:"Trade Import",
        herf :"/TradeNote/TradeImport"
    },
    {
        label:"Montly Trade Analysis",
        herf :"/TradeNote/Default"
    },
    {
        label:"Trade Analysis",
        herf :"/TradeNote/Default"
    }
    
];


export default function Menu()
{
    return(
        <div className="">
                {MenuItems.map(item=>(
                    <div className="">
                        <Link href={item.herf}>
                            <span>{item.label}</span>
                        </Link>
                    </div>
                ))}
        </div>

    );
}