"use client";

import { useState } from "react";
import { LayoutDashboard, FileBarChart2, CreditCard } from "lucide-react";
import FinanceOverview from "./FinanceOverview";
import FinanceReports from "./FinanceReports";
import VendorBankInfoSection from "./VendorBankInfoSection";

type FinanceView = "overview" | "reports" | "bank";

export default function VendorFinance() {
  const [view, setView] = useState<FinanceView>("overview");

  return (
    <div className="space-y-5">
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {(
          [
            {
              id: "overview" as FinanceView,
              label: "Overview",
              icon: <LayoutDashboard className="h-4 w-4" />,
            },
            {
              id: "reports" as FinanceView,
              label: "Reports",
              icon: <FileBarChart2 className="h-4 w-4" />,
            },
            {
              id: "bank" as FinanceView,
              label: "Bank & Payment Info",
              icon: <CreditCard className="h-4 w-4" />,
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
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {view === "overview" && <FinanceOverview />}
      {view === "reports" && <FinanceReports />}
      {view === "bank" && <VendorBankInfoSection />}
    </div>
  );
}
