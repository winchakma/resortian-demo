import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CreditCard, Smartphone } from "lucide-react";
import { BASE, inputCls, labelCls } from "@/utils";
import type { BankInfo } from "@/types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FieldError from "@/components/common/FieldError";

const bankInfoSchema = yup.object({
  bankName: yup.string().default(""),
  accountName: yup.string().default(""),
  accountNumber: yup.string().default(""),
  routingNumber: yup.string().default(""),
  bkashNumber: yup.string().default(""),
  nagadNumber: yup.string().default(""),
  rocketNumber: yup.string().default(""),
});

type BankInfoFormValues = yup.InferType<typeof bankInfoSchema>;

export default function VendorBankInfoSection() {
  const { token } = useAuth();
  const [loadingInfo, setLoadingInfo] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BankInfoFormValues>({
    resolver: yupResolver(bankInfoSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me/bank-info`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        const info: BankInfo | null = json.data ?? null;
        if (info) {
          reset({
            bankName: info.bankName ?? "",
            accountName: info.accountName ?? "",
            accountNumber: info.accountNumber ?? "",
            routingNumber: info.routingNumber ?? "",
            bkashNumber: info.bkashNumber ?? "",
            nagadNumber: info.nagadNumber ?? "",
            rocketNumber: info.rocketNumber ?? "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingInfo(false));
  }, [token, reset]);

  async function onBankInfoSubmit(data: BankInfoFormValues) {
    if (!token) return;
    try {
      const res = await fetch(`${BASE}/users/me/bank-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save bank info");
      toast.success("Bank & payment info saved!");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not save bank info.",
      );
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/30">
          <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="font-semibold text-black dark:text-white">
            Bank & Payment Info
          </h3>
          <p className="text-xs text-black dark:text-gray-500">
            Required for cashout requests
          </p>
        </div>
      </div>

      {loadingInfo ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onBankInfoSubmit)}
          noValidate
          className="space-y-5 p-6"
        >
          {/* Bank account */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black dark:text-gray-500">
              Bank Account
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls()}>Bank Name</label>
                <input
                  {...register("bankName")}
                  placeholder="e.g. Dutch-Bangla Bank"
                  className={inputCls(!!errors.bankName)}
                />
                <FieldError msg={errors.bankName?.message} />
              </div>
              <div>
                <label className={labelCls()}>Account Holder Name</label>
                <input
                  {...register("accountName")}
                  placeholder="Full name on account"
                  className={inputCls(!!errors.accountName)}
                />
                <FieldError msg={errors.accountName?.message} />
              </div>
              <div>
                <label className={labelCls()}>Account Number</label>
                <input
                  {...register("accountNumber")}
                  placeholder="Your account number"
                  className={inputCls(!!errors.accountNumber)}
                />
                <FieldError msg={errors.accountNumber?.message} />
              </div>
              <div>
                <label className={labelCls()}>Routing Number</label>
                <input
                  {...register("routingNumber")}
                  placeholder="9-digit routing number"
                  className={inputCls(!!errors.routingNumber)}
                />
                <FieldError msg={errors.routingNumber?.message} />
              </div>
            </div>
          </div>

          {/* Mobile banking */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black dark:text-gray-500">
              Mobile Banking
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls()}>bKash Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-500" />
                  <input
                    {...register("bkashNumber")}
                    placeholder="01XXXXXXXXX"
                    className={`${inputCls(!!errors.bkashNumber)} pl-10`}
                  />
                </div>
                <FieldError msg={errors.bkashNumber?.message} />
              </div>
              <div>
                <label className={labelCls()}>Nagad Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                  <input
                    {...register("nagadNumber")}
                    placeholder="01XXXXXXXXX"
                    className={`${inputCls(!!errors.nagadNumber)} pl-10`}
                  />
                </div>
                <FieldError msg={errors.nagadNumber?.message} />
              </div>
              <div>
                <label className={labelCls()}>Rocket Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  <input
                    {...register("rocketNumber")}
                    placeholder="01XXXXXXXXX"
                    className={`${inputCls(!!errors.rocketNumber)} pl-10`}
                  />
                </div>
                <FieldError msg={errors.rocketNumber?.message} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CreditCard className="h-4 w-4" />
            {isSubmitting ? "Saving…" : "Save Payment Info"}
          </button>
        </form>
      )}
    </div>
  );
}
