export default async function test()
{
    const data = await fetch("http://127.0.0.1:8000/")
    const posts = await data.json()
    console.log("akj,sdfhkjasd");
    return (
        <div>
            <h1>{posts.message}</h1>
        </div>
    );
}