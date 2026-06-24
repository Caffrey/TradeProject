import { readSegmentCacheEntry } from "next/dist/client/components/segment-cache/cache";
import { redirect } from "next/navigation";


type ImportTradeData = 
{
    file : File | null;
    Type : string;
};

const TradeSheetType = 
[    "Atas",
    "Ctrader"
];


export default function TradeImport()
{

    async function handleSumit(formData : FormData){
          "use server";
        console.log("lkasdjhflkajsd")
        

        const res = await fetch("http://localhost:8000/refreshTradeRecordDataBase", {
        method: "POST",
        body: formData,
        });

        redirect("./TradeImportSucess");
    }


    return (
        <form action={handleSumit}  className="flex">

            <select name="TradeSheetType">
             
                {TradeSheetType.map(item=>(
                    <option value={item}>{item}</option>
                ))}

            </select>
                    
            
            <input type="file" name='TradeFile'></input>

            <input type='submit' value="Sumit"></input>

        </form>
           
    );
}