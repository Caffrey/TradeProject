"use client"
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/data/router";

export default function TradeImport() {
  const {
    register,
    handleSubmit,
  } = useForm<FormData>();


  const RedirectToTradeApp = async (data: FormData) => {
    redirect(APP_ROUTES.TradeNote.herf)
  };

    const RedirectToTradeApp2 = async (data: FormData) => {
    redirect(APP_ROUTES.MarketData.herf)
  };
    return (
          <form>
            <button className="btn"
              type="button"
              onClick={handleSubmit(RedirectToTradeApp)}
            >
            `${APP_ROUTES.TradeNote.label}`
            </button>

            <button className="btn"
              type="button"
              onClick={handleSubmit(RedirectToTradeApp2)}
            >
            `${APP_ROUTES.MarketData.label}`
            </button>
        </form>
    );
}
