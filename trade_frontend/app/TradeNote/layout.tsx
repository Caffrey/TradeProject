import Menu from "../components/Menu";

export default function TradeNoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
        {/* Left */}
        <div className="w-1/6 bg-red-200"><Menu /></div>
        {/* Right */}
        <div className="w-5/6 bg-blue-200">{children}</div>
    </div>
  );
}