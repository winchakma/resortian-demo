"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { requestFcmToken } from "@/utils/firebase";
import { BASE } from "@/utils";

type PermissionState = "default" | "granted" | "denied" | "unsupported";

async function patchFcmToken(token: string, authToken: string) {
  const res = await fetch(`${BASE}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ fcmToken: token }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to save notification token");
  }
}

export default function PushNotificationSection() {
  const { token } = useAuth();
  const [permission, setPermission] = useState<PermissionState>("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission as PermissionState);
  }, []);

  async function handleEnable() {
    if (!token) {
      toast.error("Please sign in to enable notifications.");
      return;
    }

    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      toast.error("Push notifications are not supported in this browser.");
      return;
    }

    // Browser will not show the permission popup when it is already blocked.
    // The user must manually reset it in browser site settings.
    if (Notification.permission === "denied") {
      toast.error(
        "Notifications are blocked. In your browser, go to Site Settings → Notifications and allow this site, then try again.",
        { duration: 6000 },
      );
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result as PermissionState);

      if (result !== "granted") return;

      const fcmToken = await requestFcmToken();
      await patchFcmToken(fcmToken, token);
      toast.success("Push notifications enabled!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to enable notifications.",
      );
    } finally {
      setLoading(false);
    }
  }

  const isGranted = permission === "granted";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/30">
          <Bell className="h-4 w-4 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="font-semibold text-black dark:text-white">
            Push Notifications
          </h3>
          <p className="text-xs text-black dark:text-gray-500">
            Get real-time updates on your bookings
          </p>
        </div>
      </div>

      <div className="p-6">
        {isGranted ? (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/20">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Notifications enabled
              </p>
              <p className="mt-0.5 text-xs text-emerald-600/70 dark:text-emerald-400/60">
                You will receive push notifications for booking confirmations
                and updates.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-black dark:text-white">
                Stay in the loop
              </p>
              <p className="mt-0.5 text-xs text-black dark:text-gray-400">
                Receive instant alerts for booking confirmations, reminders, and
                special offers.
              </p>
            </div>
            <button
              type="button"
              onClick={handleEnable}
              disabled={loading}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <BellRing className="h-4 w-4" />
              {loading ? "Enabling…" : "Enable Notifications"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
