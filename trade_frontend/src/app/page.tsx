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

    return (
          <form>
            <button className="btn"
              type="button"
              onClick={handleSubmit(RedirectToTradeApp)}
            >
            `${APP_ROUTES.TradeNote.label}`
            </button>
        </form>
    );
}
