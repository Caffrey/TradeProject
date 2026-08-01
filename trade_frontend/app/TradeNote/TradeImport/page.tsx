"use client"

import { useForm } from "react-hook-form";
import { Request_RefreshAtasTrades,Request_RefreshMT5Trades } from "@/app/requests/RequestTrades";

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

    </form>
  );
}