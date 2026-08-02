"use client"
export default function NormalCardPanel(
    {
        Title,
        Content,
        SubContent,
    }:
    {
        Title:string,
        Content:string,
        SubContent:string,
    }
)
{
    return (
     <div className="card bg-base-100 shadow-xl ">
                <div className="card-body">
                    <h2 className="text-sm text-gray-500">
                       {Title}
                    </h2>
                    <p className="text-2xl font-bold text-success">
                        {Content}
                    </p>
                     <h2 className="text-sm text-gray-500">
                        {SubContent}
                    </h2>
                </div>
            </div>
    );
}

export function NormalCardPanel2(
    {
        Title,
        Content,
        SubContent,
    }:
    {
        Title:string,
        Content:string,
        SubContent:string,
    }
)
{
    return (
     <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-sm text-gray-500">
                       {Title}
                    </h2>
                    <p className="text-2xl font-bold text-success">
                        {Content}
                    </p>
                    <p className="text-2xl font-bold text-red-500">
                        {SubContent}
                    </p>
                </div>
            </div>
    );
}