"use client"
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/data/router";



import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";

// stylesheets
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE


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
      <div>
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

           <FullCalendar
          plugins={[themePlugin, dayGridPlugin]}
          initialView="dayGridMonth"
           events={[
            { title: "profit:256 \n asdfa \n", date: "2026-08-12" },
            { title: "event 2", date: "2026-08-10" },
          ]}
        />
        </div>
    );
}