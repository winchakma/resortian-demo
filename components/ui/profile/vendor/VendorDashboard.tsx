"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  // Globe,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { VendorView } from "@/types";
import VendorOverview from "./VendorOverview";
import VendorHotelsList from "./VendorHotelsList";
// import VendorDestinationsList from "./VendorDestinationsList";
import VendorBookingsList from "./VendorBookingsList";
import VendorCalendar from "./VendorCalendar";

export default function VendorDashboard() {
  const [view, setView] = useState<VendorView>("overview");

  return (
    <div className="space-y-5">
      {/* Sub-tab switcher */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {(
          [
            {
              id: "overview" as VendorView,
              label: "Overview",
              icon: <LayoutDashboard className="h-4 w-4" />,
            },
            {
              id: "hotels" as VendorView,
              label: "Properties & Rooms",
              icon: <Building2 className="h-4 w-4" />,
            },
            // {
            //   id: "destinations" as VendorView,
            //   label: "Destinations",
            //   icon: <Globe className="h-4 w-4" />,
            // },
            {
              id: "bookings" as VendorView,
              label: "Bookings",
              icon: <CalendarDays className="h-4 w-4" />,
            },
            {
              id: "calendar" as VendorView,
              label: "Calendar",
              icon: <CalendarRange className="h-4 w-4" />,
            },
          ] as const
        ).map((tab) => {
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              className={`flex flex-1 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-black hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {view === "overview" && <VendorOverview />}
      {view === "hotels" && <VendorHotelsList />}
      {/* {view === "destinations" && <VendorDestinationsList />} */}
      {view === "bookings" && <VendorBookingsList />}
      {view === "calendar" && <VendorCalendar />}
    </div>
  );
}
