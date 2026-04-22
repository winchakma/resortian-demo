"use client";

import { useState } from "react";
import { Building2, Globe, CalendarDays } from "lucide-react";
import { VendorView } from "@/types";
import VendorHotelsList from "./VendorHotelsList";
import VendorDestinationsList from "./VendorDestinationsList";
import VendorBookingsList from "./VendorBookingsList";

export default function VendorDashboard() {
  const [view, setView] = useState<VendorView>("hotels");

  return (
    <div className="space-y-5">
      {/* Sub-tab switcher */}
      <div className="flex gap-1 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {(
          [
            {
              id: "hotels" as VendorView,
              label: "Hotels & Rooms",
              icon: <Building2 className="h-4 w-4" />,
            },
            {
              id: "destinations" as VendorView,
              label: "Destinations",
              icon: <Globe className="h-4 w-4" />,
            },
            {
              id: "bookings" as VendorView,
              label: "Bookings",
              icon: <CalendarDays className="h-4 w-4" />,
            },
          ] as const
        ).map((tab) => {
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {view === "hotels" && <VendorHotelsList />}
      {view === "destinations" && <VendorDestinationsList />}
      {view === "bookings" && <VendorBookingsList />}
    </div>
  );
}
