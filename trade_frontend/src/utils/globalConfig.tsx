export const DefaultTimeZone:number = 8;


export function ServerTimeToClientTime(time:Date)
{
    return new Date(
        time.getTime() + DefaultTimeZone * 60 * 60 * 1000
    );
}

export function ServerTimeToClientTimeDate(time:string)
{
    const date = new Date(time);

    return new Date(
        date.getTime() + DefaultTimeZone * 60 * 60 * 1000
    );
}

export function ServerTimeToClientTimeStr(time: string): string {
    const utcTime = new Date(
        time.replace(" ", "T") + "Z"
    );

    const clientTime = new Date(
        utcTime.getTime() + DefaultTimeZone * 60 * 60 * 1000
    );

    return clientTime
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);
}