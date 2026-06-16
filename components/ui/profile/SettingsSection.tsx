import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BASE, labelCls, inputCls } from "@/utils";
import { toast } from "react-hot-toast";
import { Lock, Eye, EyeOff, Trash2 } from "lucide-react";
import PushNotificationSection from "./PushNotificationSection";
import FieldError from "@/components/common/FieldError";
import * as yup from "yup";

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Za-z]/, "Must include at least one letter")
    .matches(/[0-9]/, "Must include at least one number"),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

type PasswordFormValues = yup.InferType<typeof passwordSchema>;

export default function SettingsSection() {
  const { token } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: yupResolver(passwordSchema),
    mode: "onTouched",
  });

  async function onPasswordSubmit(data: PasswordFormValues) {
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }
    try {
      const res = await fetch(`${BASE}/users/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update password");
      toast.success(json.message || "Password updated successfully!");
      reset();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="space-y-5">
      <PushNotificationSection />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/30">
            <Lock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Change Password
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Keep your account secure with a strong password
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onPasswordSubmit)}
          noValidate
          className="space-y-4 p-6"
        >
          <div>
            <label className={labelCls()}>Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrent ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="Enter current password"
                className={`${inputCls(!!errors.currentPassword)} pl-10 pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError msg={errors.currentPassword?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls()}>New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  {...register("newPassword")}
                  placeholder="Min. 8 chars, letter + number"
                  className={`${inputCls(!!errors.newPassword)} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError msg={errors.newPassword?.message} />
            </div>
            <div>
              <label className={labelCls()}>Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Re-enter new password"
                  className={`${inputCls(!!errors.confirmPassword)} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError msg={errors.confirmPassword?.message} />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {isSubmitting ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900/40 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-red-100 bg-red-50 px-6 py-4 dark:border-red-900/30 dark:bg-red-950/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/40">
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-red-700 dark:text-red-400">
              Danger Zone
            </h3>
            <p className="text-xs text-red-500/80 dark:text-red-500/60">
              Irreversible account actions
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Delete Account
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Permanently delete your account and all data. This cannot be
              undone.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.error("Please contact support to delete your account.")
            }
            className="shrink-0 rounded-xl border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
