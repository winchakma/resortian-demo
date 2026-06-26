import { ApprovalStatus, VendorBookingStatus } from "@/types";

export const fmtDate = (iso: string) => {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const initials = (name: string) => {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export const labelCls = () => {
  return "mb-1.5 block text-sm font-medium text-black dark:text-gray-300";
};

export const inputCls = (hasError?: boolean) => {
  return [
    "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-black placeholder-gray-400 outline-none transition-colors",
    "focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
      : "border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-primary-500/20 dark:border-gray-700 dark:focus:bg-gray-800",
  ].join(" ");
};

export const APPROVAL_CONFIG: Record<
  ApprovalStatus,
  { label: string; pill: string; dot: string }
> = {
  APPROVED: {
    label: "Approved",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Under Review",
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    dot: "bg-amber-400",
  },
  REJECTED: {
    label: "Rejected",
    pill: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-400",
  },
};

export const VENDOR_BOOKING_STATUS_CONFIG: Record<
  VendorBookingStatus,
  { label: string; pill: string; dot: string }
> = {
  CONFIRMED: {
    label: "Confirmed",
    pill: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  PENDING: {
    label: "Pending",
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    dot: "bg-amber-400",
  },
  COMPLETED: {
    label: "Completed",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    pill: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-400",
  },
};
