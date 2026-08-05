import { ServerTimeToClientTime,ServerTimeToClientTimeDate,ServerTimeToClientTimeStr } from "./globalConfig";

const TimeFieldList = [
    "OpenTime",
    "CloseTime",
    "Date"
];

function IsTimeField(key:string)
{
    return TimeFieldList.includes(
        key
    );
}

function IsTimeString(value:any)
{
    if(typeof value !== "string")
        return false;


    // ISO时间格式
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
}

function ProcessTimeRecursive(data:any):any
{
    if(data === null || data === undefined)
    {
        return data;
    }


    // Array
    if(Array.isArray(data))
    {
        return data.map(
            item=>ProcessTimeRecursive(item)
        );
    }


    // Object
    if(typeof data === "object")
    {
        const result:any = {};


        Object.keys(data).forEach(key=>{

            const value=data[key];
            if(
                IsTimeField(key) 
            )
            {

                result[key] =
                    ServerTimeToClientTimeStr(value);
            }
            else
            {

                result[key] =
                    ProcessTimeRecursive(value);
            }

        });


        return result;
    }


    return data;
}


export async function fetchWithTimeZoneProcess<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    const data: T = await res.json();

    return ProcessTimeRecursive(data);
}