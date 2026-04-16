"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LogIn,
  User,
  Mail,
  Phone,
  // MessageSquare,
  CreditCard,
  Lock,
  CheckCircle2,
  ShoppingBag,
  ChevronRight,
  Eye,
  EyeOff,
  Smartphone,
  Banknote,
  Info,
  Check,
  BadgeCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiLogin } from "@/utils/auth";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

type AuthMode = "login" | "guest";
type PaymentMethod = "stripe" | "uddoktapay";
type Step = "details" | "payment" | "confirmed";

// ── BD phone regex: starts with +880 or 01, then 9 digits (operator prefix 1x)
const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;

// ── Yup schemas ──────────────────────────────────────────────────────────────

const loginSchema = yup.object({
  loginPhone: yup
    .string()
    .required("Phone number is required")
    .matches(BD_PHONE_REGEX, "Enter a valid phone number"),
  loginPassword: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const guestSchema = yup.object({
  guestName: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  guestEmail: yup
    .string()
    .required("Email address is required")
    .email("Enter a valid email address"),
  guestPhone: yup
    .string()
    .required("Phone number is required")
    .matches(BD_PHONE_REGEX, "Enter a valid phone number"),
  guestRequests: yup.string().optional(),
});

// ── Type helpers ─────────────────────────────────────────────────────────────
type LoginFormValues = yup.InferType<typeof loginSchema>;
// Manual type: guestRequests must be optional (?) not just `string | undefined`
// to satisfy react-hook-form's Resolver constraint.
type GuestFormValues = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestRequests?: string;
};

// ── Shared error message component ───────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">
      {message}
    </p>
  );
}

// ── Input class helper ────────────────────────────────────────────────────────
function inputCls(hasError?: boolean) {
  return [
    "w-full rounded-xl border bg-gray-50 py-3 text-sm text-gray-900 placeholder-gray-400",
    "focus:outline-none focus:ring-2",
    "dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
      : "border-gray-300 focus:border-primary-500 focus:bg-white focus:ring-primary-500/20 dark:border-gray-600 dark:focus:bg-gray-800",
  ].join(" ");
}

const ADVANCE_RATE = 0.2;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function CheckoutContent() {
  const { items, totalAmount, clearCart } = useCart();
  const { user, token, setAuth } = useAuth();
  const advanceAmount = Math.round(totalAmount * ADVANCE_RATE);
  const balanceAmount = totalAmount - advanceAmount;

  const [authMode, setAuthMode] = useState<AuthMode>("guest");
  const [step, setStep] = useState<Step>("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  // Guest details captured in step 1, used when submitting in step 2
  const [savedGuestDetails, setSavedGuestDetails] =
    useState<GuestFormValues | null>(null);
  // Snapshot values shown on the confirmed screen (after cart is cleared)
  const [confirmedAdvance, setConfirmedAdvance] = useState(0);
  const [confirmedBalance, setConfirmedBalance] = useState(0);
  const [confirmedReferences, setConfirmedReferences] = useState<string[]>([]);

  // ── Forms ─────────────────────────────────────────────────────────────────
  const loginForm = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  const guestForm = useForm<GuestFormValues>({
    resolver: yupResolver(guestSchema) as Resolver<GuestFormValues>,
    mode: "onTouched",
  });

  // Auto-populate guest form when user is logged in
  useEffect(() => {
    if (user) {
      guestForm.setValue("guestName", user.name);
      guestForm.setValue("guestPhone", user.phone);
      if (user.email) guestForm.setValue("guestEmail", user.email);
    }
  }, [user, guestForm]);

  // ── Submit handlers ───────────────────────────────────────────────────────
  function handleGuestDetailsNext(data: GuestFormValues) {
    setSavedGuestDetails(data);
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLoginSubmit(data: LoginFormValues) {
    setLoginSubmitting(true);
    try {
      const res = await apiLogin({
        identifier: data.loginPhone,
        password: data.loginPassword,
      });
      setAuth(res.user, res.accessToken);
      toast.success(`Welcome back, ${res.user.name}!`);
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginSubmitting(false);
    }
  }

  async function handlePaymentConfirm() {
    setBookingSubmitting(true);
    try {
      const isAuthenticated = !!token;

      // For guest bookings, we need the details saved from step 1
      const guestDetails = savedGuestDetails ?? guestForm.getValues();

      const results = await Promise.all(
        items.map((item) => {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };
          if (isAuthenticated) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const body: Record<string, unknown> = {
            roomId: item.roomId,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            guests: item.capacity,
            paymentMethod: paymentMethod.toUpperCase(),
          };

          if (!isAuthenticated) {
            body.guestName = guestDetails.guestName;
            body.guestPhone = guestDetails.guestPhone;
            if (guestDetails.guestEmail) {
              body.guestEmail = guestDetails.guestEmail;
            }
          }

          return fetch(`${API_BASE}/bookings`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          }).then(async (res) => {
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(
                (err as { message?: string }).message ?? `HTTP ${res.status}`,
              );
            }
            return res.json() as Promise<{
              booking: {
                reference: string;
                advancePaid: number;
                balanceDue: number;
              };
            }>;
          });
        }),
      );
      console.log({ results });

      const references = results.map((r) => r.booking.reference);
      const totalAdvance = results.reduce(
        (sum, r) => sum + r.booking.advancePaid,
        0,
      );
      const totalBalance = results.reduce(
        (sum, r) => sum + r.booking.balanceDue,
        0,
      );

      setConfirmedReferences(references);
      setConfirmedAdvance(totalAdvance);
      setConfirmedBalance(totalBalance);
      setStep("confirmed");
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Booking failed. Please try again.",
      );
    } finally {
      setBookingSubmitting(false);
    }
  }

  // ── Confirmed ─────────────────────────────────────────────────────────────
  if (step === "confirmed") {
    const primaryRef = confirmedReferences[0] ?? "—";
    return (
      <div className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="mx-auto w-full max-w-md px-4">
          {/* Success icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950/40">
              <CheckCircle2 className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Booking Confirmed!
          </h1>
          <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
            Your reservation is secured. A confirmation has been sent to your
            inbox.
          </p>

          {/* Booking reference */}
          <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-5 dark:border-primary-900/30 dark:bg-primary-950/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Booking Reference
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-gray-900 dark:text-white">
              {primaryRef}
            </p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Keep this reference for your records.
            </p>
          </div>

          {/* Payment summary */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Payment Summary
              </p>
            </div>

            {/* Paid now */}
            <div className="flex items-center justify-between bg-primary-50 px-5 py-4 dark:bg-primary-950/30">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
                  <CreditCard className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                    Advance Paid
                  </p>
                  <p className="text-xs text-primary-600/70 dark:text-primary-500">
                    20% — charged today
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
                ৳{confirmedAdvance.toLocaleString()}
              </span>
            </div>

            {/* Due at hotel */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Banknote className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Due at Hotel
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    80% — pay at check-in
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                ৳{confirmedBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* What to expect */}
          <div className="mt-4 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">
              Please present your booking reference{" "}
              <strong className="font-semibold">{primaryRef}</strong> at the
              front desk. The remaining{" "}
              <strong className="font-semibold">
                ৳{confirmedBalance.toLocaleString()}
              </strong>{" "}
              will be collected when you check in.
            </p>
          </div>

          <Link
            href="/"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top nav */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      {/* Progress steps */}
      <div className="mb-10 flex items-center gap-2">
        {(["details", "payment"] as const).map((s, idx) => {
          const labels = ["Guest Details", "Payment"];
          const active = s === step;
          const done = step === "payment" && s === "details";
          return (
            <div key={s} className="flex items-center gap-2">
              {idx > 0 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-700" />
              )}
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    done
                      ? "bg-primary-600 text-white"
                      : active
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    active
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {labels[idx]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* ── Left column ── */}
        <div className="space-y-6">
          {/* ── STEP: details ── */}
          {step === "details" && (
            <div className="space-y-6">
              {/* Auth toggle card — hidden when already logged in */}
              {user ? (
                <div className="flex items-center gap-3 rounded-2xl border border-primary-200 bg-primary-50 px-5 py-4 dark:border-primary-900/40 dark:bg-primary-950/20">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                      Signed in as {user.name}
                    </p>
                    <p className="text-xs text-primary-600/70 dark:text-primary-500">
                      Your details have been pre-filled below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex border-b border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => setAuthMode("guest")}
                      className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                        authMode === "guest"
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400"
                          : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Continue as Guest
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                        authMode === "login"
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400"
                          : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </button>
                  </div>

                  {/* ── Login form ── */}
                  {authMode === "login" ? (
                    <form
                      onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                      className="space-y-4 p-6"
                      noValidate
                    >
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sign in to auto-fill your details and track bookings.
                      </p>

                      {/* Login Phone */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            {...loginForm.register("loginPhone")}
                            placeholder="01XXXXXXXXX"
                            className={`${inputCls(!!loginForm.formState.errors.loginPhone)} pl-10 pr-4`}
                          />
                        </div>
                        <FieldError
                          message={
                            loginForm.formState.errors.loginPhone?.message
                          }
                        />
                      </div>

                      {/* Login Password */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            {...loginForm.register("loginPassword")}
                            placeholder="••••••••"
                            className={`${inputCls(!!loginForm.formState.errors.loginPassword)} pl-10 pr-12`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <FieldError
                          message={
                            loginForm.formState.errors.loginPassword?.message
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          Remember me
                        </label>
                        <a
                          href="#"
                          className="text-primary-600 hover:underline dark:text-primary-400"
                        >
                          Forgot password?
                        </a>
                      </div>

                      <button
                        type="submit"
                        disabled={loginSubmitting}
                        className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
                      >
                        {loginSubmitting ? "Signing in…" : "Sign In"}
                      </button>

                      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link
                          href="/auth/customer"
                          className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                        >
                          Create one
                        </Link>
                      </p>
                    </form>
                  ) : (
                    <div className="px-6 pt-5 pb-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No account needed — fill in your details below.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Guest info form ── */}
              <form
                onSubmit={guestForm.handleSubmit(handleGuestDetailsNext)}
                className="space-y-6"
                noValidate
              >
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Guest Information
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      This information will be used for your reservation.
                    </p>
                  </div>

                  <div className="grid gap-5 p-6 sm:grid-cols-2">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          {...guestForm.register("guestName")}
                          placeholder="Ahmed Rahman"
                          className={`${inputCls(!!guestForm.formState.errors.guestName)} pl-10 pr-4`}
                        />
                      </div>
                      <FieldError
                        message={guestForm.formState.errors.guestName?.message}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          {...guestForm.register("guestEmail")}
                          placeholder="ahmed@example.com"
                          className={`${inputCls(!!guestForm.formState.errors.guestEmail)} pl-10 pr-4`}
                        />
                      </div>
                      <FieldError
                        message={guestForm.formState.errors.guestEmail?.message}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          {...guestForm.register("guestPhone")}
                          placeholder="01XXXXXXXXX"
                          className={`${inputCls(!!guestForm.formState.errors.guestPhone)} pl-10 pr-4`}
                        />
                      </div>
                      <FieldError
                        message={guestForm.formState.errors.guestPhone?.message}
                      />
                    </div>

                    {/* Special requests */}
                    {/* <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Special Requests
                        <span className="ml-1.5 text-xs font-normal text-gray-400">
                          (optional)
                        </span>
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                        <textarea
                          rows={3}
                          {...guestForm.register("guestRequests")}
                          placeholder="Early check-in, late checkout, dietary requirements..."
                          className={`${inputCls()} pl-10 pr-4`}
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
                >
                  Continue to Payment
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* ── STEP: payment ── */}
          {step === "payment" && (
            <div className="space-y-5">
              {/* Payment method selector */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Select Payment Method
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    You will be redirected to the payment gateway to complete
                    your transaction securely.
                  </p>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  {/* ── Stripe / Card option ── */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`group flex flex-col gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                      paymentMethod === "stripe"
                        ? "border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-950/30"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-gray-600"
                    }`}
                  >
                    {/* Top row: logo + check */}
                    <div className="flex items-center justify-between gap-2">
                      {/* Stripe wordmark on brand background */}
                      <div className="flex h-9 items-center rounded-lg bg-[#635BFF] px-3">
                        <svg
                          viewBox="0 0 48 20"
                          fill="none"
                          className="h-4 w-auto"
                          aria-label="Stripe"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Stripe "S" mark */}
                          <path
                            d="M4.2 7.8c0-.6.5-.8 1.3-.8 1.1 0 2.5.4 3.7 1V4.7C8 4.2 6.8 4 5.5 4 2.5 4 .4 5.5.4 8c0 3.5 4.8 3 4.8 4.4 0 .7-.6.9-1.4.9-1.2 0-2.8-.5-4-1.2v3.2c1.4.6 2.8.9 4 .9 3.1 0 5.1-1.5 5.1-3.8C8.9 9 4.2 9.5 4.2 7.8z"
                            fill="white"
                          />
                          <path
                            d="M12.4 2.2l-3.3.7v11.2l3.3-.7V2.2z"
                            fill="white"
                          />
                          <path
                            d="M21.2 5.8c-.6 0-1.1.2-1.5.5V2.2l-3.3.7v11.2h3.3V9.3c.4-.3.9-.5 1.4-.5 1 0 1.4.7 1.4 1.7v4.9h3.4V10c0-2.1-1.2-4.2-4.7-4.2z"
                            fill="white"
                          />
                          <path
                            d="M30.1 5.8c-2.4 0-4 1.8-4 4.5 0 2.9 1.6 4.3 4 4.3 1.1 0 2.1-.3 2.9-.9l.2.7h3V6h-3l-.3.9c-.8-.7-1.7-1.1-2.8-1.1zm1.1 6.4c-.5 0-.9-.2-1.2-.6V9.2c.3-.3.7-.5 1.2-.5.9 0 1.4.6 1.4 1.8 0 1.2-.5 1.7-1.4 1.7z"
                            fill="white"
                          />
                          <path
                            d="M37.2 5.9V14h3.3V5.9h-3.3zm1.7-4c-1.1 0-1.9.8-1.9 1.8s.8 1.8 1.9 1.8 1.9-.8 1.9-1.8-.8-1.8-1.9-1.8z"
                            fill="white"
                          />
                          <path
                            d="M46.8 6.1c-.5-.2-1.1-.3-1.7-.3-2.5 0-4.1 1.8-4.1 4.5 0 2.9 1.6 4.3 4.1 4.3.7 0 1.3-.1 1.7-.3v-2.5c-.3.2-.7.3-1.1.3-.9 0-1.5-.6-1.5-1.8 0-1.2.6-1.8 1.5-1.8.4 0 .8.1 1.1.3V6.1z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      {/* Check indicator — inside layout, no absolute */}
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          paymentMethod === "stripe"
                            ? "border-primary-600 bg-primary-600 dark:border-primary-400 dark:bg-primary-400"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {paymentMethod === "stripe" && (
                          <Check
                            className="h-3 w-3 text-white"
                            strokeWidth={2.5}
                          />
                        )}
                      </div>
                    </div>

                    {/* Labels */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Credit / Debit Card
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        Visa · Mastercard · Amex
                      </p>
                    </div>
                  </button>

                  {/* ── UddoktaPay / Mobile option ── */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("uddoktapay")}
                    className={`group flex flex-col gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                      paymentMethod === "uddoktapay"
                        ? "border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-950/30"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-gray-600"
                    }`}
                  >
                    {/* Top row: logo + check */}
                    <div className="flex items-center justify-between gap-2">
                      {/* UddoktaPay brand bar */}
                      <div className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#e2136e] via-[#f55f14] to-[#8b3fc7] px-3">
                        <Smartphone className="h-4 w-4 text-white" />
                        {/* <span className="text-xs font-bold tracking-wide text-white">
                          UddoktaPay
                        </span> */}
                      </div>
                      {/* Check indicator */}
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          paymentMethod === "uddoktapay"
                            ? "border-primary-600 bg-primary-600 dark:border-primary-400 dark:bg-primary-400"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {paymentMethod === "uddoktapay" && (
                          <Check
                            className="h-3 w-3 text-white"
                            strokeWidth={2.5}
                          />
                        )}
                      </div>
                    </div>

                    {/* Labels */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Mobile Banking
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        bKash · Nagad · Rocket
                      </p>
                    </div>
                  </button>
                </div>

                {/* What-happens-next note */}
                <div className="mx-5 mb-5 flex gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {paymentMethod === "stripe"
                      ? "Clicking the button below will redirect you to Stripe's secure checkout page to enter your card details."
                      : "Clicking the button below will redirect you to UddoktaPay where you can complete payment via bKash, Nagad, or Rocket."}
                  </p>
                </div>
              </div>

              {/* Security notice */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                <Lock className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  All transactions are protected with 256-bit SSL encryption.
                  Resortian never stores your payment details.
                </p>
              </div>

              {/* Single submit */}
              <button
                type="button"
                onClick={handlePaymentConfirm}
                disabled={bookingSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bookingSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Confirming Booking…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay ৳{advanceAmount.toLocaleString()} Advance &amp; Confirm
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Order summary ── */}
        <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="font-bold text-gray-900 dark:text-white">
              Order Summary
            </h2>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.cartId} className="flex gap-3">
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.roomImage}
                    alt={item.roomName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {item.roomName}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {item.hotelName}
                  </p>
                  {item.checkIn && item.checkOut && (
                    <p className="mt-0.5 text-xs text-primary-600 dark:text-primary-400">
                      {item.checkIn} → {item.checkOut}
                      {item.nights
                        ? ` · ${item.nights} night${item.nights !== 1 ? "s" : ""}`
                        : ""}
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
                  ৳{(item.totalPrice ?? item.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Total booking value</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                ৳{totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Service fee</span>
              <span className="text-primary-600 dark:text-primary-400">
                Free
              </span>
            </div>
          </div>

          <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

          {/* Payment split */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3 dark:bg-primary-950/30">
              <div>
                <p className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                  Pay now — 20% advance
                </p>
                <p className="mt-0.5 text-[10px] text-primary-600/70 dark:text-primary-500">
                  Charged today to confirm
                </p>
              </div>
              <span className="text-xl font-bold text-primary-700 dark:text-primary-300">
                ৳{advanceAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Pay at hotel — 80%
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                  Due at check-in
                </p>
              </div>
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                ৳{balanceAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
