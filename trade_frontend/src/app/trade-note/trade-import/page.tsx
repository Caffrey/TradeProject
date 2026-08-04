"use client"

import { useForm } from "react-hook-form";
import { Request_RefreshAtasTrades,Request_RefreshMT5Trades } from "@/requests/requestTrades";
import { Request_RefreshFutre,Request_HistoryData,Request_MarketDataValidSymbols } from "@/requests/requestMarketData";

type FormData = {
};

export default function TradeImport() {
  const {
    register,
    handleSubmit,
  } = useForm<FormData>();


  const AtasRequest = async (data: FormData) => {
    console.log("登录请求", data);
     Request_RefreshAtasTrades()
  };


  const saveRequest = async (data: FormData) => {
    console.log("保存请求", data);
     Request_RefreshMT5Trades()
  };

  


  return (
    <form>
      <button className="btn"
        type="button"
        onClick={handleSubmit(AtasRequest)}
      >
        刷新ATAS
      </button>


      <button className="btn"
        type="button"
        onClick={handleSubmit(saveRequest)}
      >
        刷新MT5
      </button>

      <button className="btn"
        type="button"
        onClick={()=>{Request_RefreshFutre()}}
      >
          刷新Future数据
      </button>

      
      <button className="btn"
        type="button"
        onClick={()=>{Request_MarketDataValidSymbols("future")}}
      >
          刷新Future数据2
      </button>

       <button className="btn"
        type="button"
        onClick={()=>{Request_HistoryData("future","NQ=F")}}
      >
          刷新Future数据23
      </button>

    </form>
  );
}