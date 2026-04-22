"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const { logout } = useAuth();
  return (
    <button
      type="button"
      onClick={() => logout()}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
