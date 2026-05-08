"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { Booking, UserProfile } from "@/types";
import { fmtDate, BASE, labelCls, inputCls } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import FieldError from "@/components/common/FieldError";
import {
  CalendarDays,
  CheckCircle2,
  Moon,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Shield,
  Store,
  Edit2,
  X,
  Save,
} from "lucide-react";

const profileSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name is too short"),
  email: yup.string().email("Invalid email address").default(""),
  address: yup.string().default(""),
});

type ProfileFormValues = yup.InferType<typeof profileSchema>;

export default function ProfileSection({
  user,
  totalNights,
  completedCount,
  bookings,
  isVendor,
  onProfileUpdate,
}: {
  user: UserProfile;
  totalNights: number;
  completedCount: number;
  bookings: Booking[];
  isVendor: boolean;
  onProfileUpdate: (updated: UserProfile) => void;
}) {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const totalSpend = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + b.advancePaid, 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email || "",
      address: user.address || "",
    },
    mode: "onTouched",
  });

  function handleEditClick() {
    reset({
      name: user.name,
      email: user.email || "",
      address: user.address || "",
    });
    setIsEditing(true);
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
  }

  async function onSubmit(data: ProfileFormValues) {
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }
    try {
      const res = await fetch(`${BASE}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email || undefined,
          address: data.address || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update profile");
      onProfileUpdate({
        ...user,
        name: json.name ?? data.name,
        email: json.email ?? data.email ?? "",
        address: json.address ?? data.address ?? "",
      } as UserProfile);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="space-y-5">
      {!isVendor && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Bookings",
              value: bookings.length,
              icon: (
                <CalendarDays className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              ),
              bg: "bg-primary-50 dark:bg-primary-950/30",
            },
            {
              label: "Trips Completed",
              value: completedCount,
              icon: (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ),
              bg: "bg-emerald-50 dark:bg-emerald-950/30",
            },
            {
              label: "Total Nights",
              value: totalNights,
              icon: (
                <Moon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              ),
              bg: "bg-violet-50 dark:bg-violet-950/30",
            },
            {
              label: "Advance Paid",
              value: `৳${totalSpend.toLocaleString()}`,
              icon: (
                <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              ),
              bg: "bg-amber-50 dark:bg-amber-950/30",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              Your account details
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={handleEditClick}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-primary-700 dark:hover:bg-primary-950/30 dark:hover:text-primary-400"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </button>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            )}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/30">
              <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        {isEditing ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4 p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls()}>
                  <User className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Your full name"
                  className={inputCls(!!errors.name)}
                />
                <FieldError msg={errors.name?.message} />
              </div>
              <div>
                <label className={labelCls()}>
                  <Phone className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={user.phone}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-500"
                />
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  Phone number cannot be changed as it is used for login.
                </p>
              </div>
            </div>
            <div>
              <label className={labelCls()}>
                <Mail className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="your@email.com"
                className={inputCls(!!errors.email)}
              />
              <FieldError msg={errors.email?.message} />
            </div>
            <div>
              <label className={labelCls()}>
                <MapPin className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                Address
              </label>
              <input
                type="text"
                {...register("address")}
                placeholder="Your address (optional)"
                className={inputCls(!!errors.address)}
              />
              <FieldError msg={errors.address?.message} />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              {
                icon: <User className="h-4 w-4 text-gray-400" />,
                label: "Full Name",
                value: user.name,
              },
              {
                icon: <Mail className="h-4 w-4 text-gray-400" />,
                label: "Email Address",
                value: user.email || "—",
              },
              {
                icon: <Phone className="h-4 w-4 text-gray-400" />,
                label: "Phone Number",
                value: user.phone,
              },
              {
                icon: <MapPin className="h-4 w-4 text-gray-400" />,
                label: "Address",
                value: user.address || "—",
              },
              {
                icon: <Star className="h-4 w-4 text-gray-400" />,
                label: "Member Since",
                value: fmtDate(user.memberSince),
              },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  {row.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {row.label}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-gray-900 dark:text-white">
                    {row.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isVendor ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 p-6 shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-violet-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-violet-200">
                  Resortian Vendor
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {user.name}
              </h3>
              <p className="mt-1 text-sm text-violet-100">
                Partner since {fmtDate(user.memberSince)}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <Shield className="h-8 w-8 text-violet-300" />
              <p className="mt-1 text-xs text-violet-200">Property Owner</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 p-6 shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-200">
                  Resortian Member
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {user.name}
              </h3>
              <p className="mt-1 text-sm text-primary-100">
                Member since {fmtDate(user.memberSince)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{bookings.length}</p>
              <p className="text-xs text-primary-200">Total Bookings</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
