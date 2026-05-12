"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Info,
  BadgeCheck,
  ExternalLink,
  Tag,
  X,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiLogin } from "@/utils/auth";
import { trackEvent } from "@/lib/gtag";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

type AuthMode = "login" | "guest";
type Step = "details" | "payment";

// ── BD phone regex: starts with +880 or 01, then 9 digits (operator prefix 1x)
const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8,9}$/;

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [authMode, setAuthMode] = useState<AuthMode>("guest");
  const [step, setStep] = useState<Step>("details");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  // Guest details captured in step 1, used when submitting in step 2
  const [savedGuestDetails, setSavedGuestDetails] =
    useState<GuestFormValues | null>(null);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoValidating, setPromoValidating] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    maxDiscountAmount: number | null;
    minBookingAmount: number | null;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  // Ref for the guest details form so mobile fixed button can trigger submit
  const guestFormRef = useRef<HTMLFormElement>(null);

  // Derived totals — recomputed on every render so they stay in sync with appliedPromo
  const promoDiscount = calcDiscount(appliedPromo, totalAmount);
  const discountedTotal = Math.max(0, totalAmount - promoDiscount);
  const advancePay = Math.round(discountedTotal * ADVANCE_RATE);
  const balancePay = discountedTotal - advancePay;

  // Auto-advance to payment when returning from Google OAuth
  const advancedRef = useRef(false);
  useEffect(() => {
    if (advancedRef.current) return;
    if (user && searchParams.get("fromLogin") === "1") {
      advancedRef.current = true;
      setStep("payment");
      router.replace("/checkout");
    }
  }, [user, searchParams, router]);

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
    trackEvent("begin_booking", {
      hotel_id: items[0]?.hotelId ?? "",
      hotel_name: items[0]?.hotelName ?? "",
      value: totalAmount,
      currency: "BDT",
    });
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

  function calcDiscount(promo: typeof appliedPromo, amount: number): number {
    if (!promo) return 0;
    if (promo.minBookingAmount !== null && amount < promo.minBookingAmount)
      return 0;
    if (promo.discountType === "PERCENTAGE") {
      const d = Math.round((amount * promo.discountValue) / 100);
      return promo.maxDiscountAmount !== null
        ? Math.min(d, promo.maxDiscountAmount)
        : d;
    }
    return Math.min(promo.discountValue, amount);
  }

  async function handleApplyPromo() {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;
    setPromoError("");
    setPromoValidating(true);
    try {
      const res = await fetch(`${API_BASE}/promo-codes/validate/${code}`);
      if (!res.ok) {
        const err = (await res.json()) as { message?: string };
        setPromoError(err.message ?? "Invalid promo code");
        return;
      }
      const promo = (await res.json()) as typeof appliedPromo;
      setAppliedPromo(promo);
      setPromoCodeInput("");
      toast.success("Promo code applied!");
    } catch {
      setPromoError("Could not validate promo code");
    } finally {
      setPromoValidating(false);
    }
  }

  function removePromo() {
    setAppliedPromo(null);
    setPromoError("");
    setPromoCodeInput("");
  }

  async function handlePaymentConfirm() {
    setBookingSubmitting(true);
    try {
      const guestDetails = savedGuestDetails ?? guestForm.getValues();
      const name = guestDetails.guestName || user?.name || "";
      const phone = guestDetails.guestPhone || user?.phone || "";
      const email = guestDetails.guestEmail || user?.email;

      // NEXT_PUBLIC_SITE_URL overrides window.location.origin so redirect URLs
      // work correctly in environments where UddoktaPay strips non-standard ports.
      const origin =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
        window.location.origin;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/payments/uddoktapay/init-cart`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: items.map((item) => ({
            roomId: item.roomId,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            guests: item.capacity,
          })),
          guestName: name,
          guestPhone: phone,
          ...(email ? { guestEmail: email } : {}),
          ...(appliedPromo ? { promoCode: appliedPromo.code } : {}),
          successUrl: `${origin}/payment/success`,
          cancelUrl: `${origin}/payment/cancel`,
        }),
      });

      const data = (await res.json()) as {
        payment_url?: string;
        bookings?: {
          reference: string;
          advancePaid: number;
          balanceDue: number;
        }[];
        totalAdvance?: number;
        totalBalance?: number;
        message?: string;
      };

      if (!res.ok || !data.payment_url) {
        throw new Error(data.message ?? "Failed to initiate payment");
      }

      const references = (data.bookings ?? []).map((b) => b.reference);
      const totalAdvance =
        data.totalAdvance ??
        (data.bookings ?? []).reduce((s, b) => s + b.advancePaid, 0);
      const totalBalance =
        data.totalBalance ??
        (data.bookings ?? []).reduce((s, b) => s + b.balanceDue, 0);

      trackEvent("complete_booking", {
        transaction_id: references[0] ?? "",
        hotel_id: items[0]?.hotelId ?? "",
        hotel_name: items[0]?.hotelName ?? "",
        value: totalAdvance + totalBalance,
        currency: "BDT",
      });

      clearCart();
      window.location.href = data.payment_url;
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Booking failed. Please try again.",
      );
      setBookingSubmitting(false);
    }
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
        <div className="space-y-6 pb-28 lg:pb-0">
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

                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          or
                        </span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                      </div>

                      <GoogleSignInButton
                        label="Sign in with Google"
                        redirectTo="/checkout?fromLogin=1"
                      />
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
                ref={guestFormRef}
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
                  className="hidden w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800 lg:flex"
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
              {/* UddoktaPay payment card */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Secure Payment
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    You will be redirected to UddoktaPay&apos;s secure checkout
                    to complete your payment.
                  </p>
                </div>

                <div className="p-5">
                  {/* UddoktaPay branding */}
                  <div className="flex items-center gap-4 rounded-2xl border-2 border-primary-200 bg-primary-50 p-5 dark:border-primary-800/50 dark:bg-primary-950/20">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        UddoktaPay Checkout
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        bKash · Nagad · Rocket · and more
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-primary-500 dark:text-primary-400" />
                  </div>

                  {/* Accepted methods */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["bKash", "Nagad", "Rocket"].map((m) => (
                      <span
                        key={m}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What happens next */}
                <div className="mx-5 mb-5 flex gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    Clicking the button below will create your booking and
                    redirect you to UddoktaPay&apos;s secure payment page. Your
                    booking will be confirmed automatically after successful
                    payment.
                  </p>
                </div>
              </div>

              {/* Moneybag payment card — disabled */}
              {/* <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Secure Payment</h2>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    You will be redirected to Moneybag&apos;s secure checkout to complete your payment.
                  </p>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 rounded-2xl border-2 border-primary-200 bg-primary-50 p-5 dark:border-primary-800/50 dark:bg-primary-950/20">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">Moneybag Checkout</p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Cards · bKash · Nagad · Rocket · and more</p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-primary-500 dark:text-primary-400" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Visa", "Mastercard", "bKash", "Nagad", "Rocket"].map((m) => (
                      <span key={m} className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{m}</span>
                    ))}
                  </div>
                </div>
                <div className="mx-5 mb-5 flex gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    Clicking the button below will create your booking and redirect you to Moneybag&apos;s secure payment page. Your booking will be confirmed automatically after successful payment.
                  </p>
                </div>
              </div> */}

              {/* Promo code */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                  <h2 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    <Tag className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    Promo Code
                  </h2>
                </div>
                <div className="p-5">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 dark:border-primary-800/50 dark:bg-primary-950/20">
                      <div>
                        <p className="text-sm font-bold text-primary-700 dark:text-primary-300 font-mono">
                          {appliedPromo.code}
                        </p>
                        <p className="text-xs text-primary-600/80 dark:text-primary-500">
                          {appliedPromo.discountType === "PERCENTAGE"
                            ? `${appliedPromo.discountValue}% off`
                            : `৳${appliedPromo.discountValue.toLocaleString()} off`}
                          {appliedPromo.maxDiscountAmount
                            ? ` (max ৳${appliedPromo.maxDiscountAmount.toLocaleString()})`
                            : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removePromo}
                        className="rounded-lg p-1.5 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => {
                          setPromoCodeInput(e.target.value.toUpperCase());
                          setPromoError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void handleApplyPromo();
                          }
                        }}
                        placeholder="Enter promo code"
                        className={`${inputCls(!!promoError)} flex-1 px-4 font-mono uppercase`}
                      />
                      <button
                        type="button"
                        onClick={() => void handleApplyPromo()}
                        disabled={promoValidating || !promoCodeInput.trim()}
                        className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                      >
                        {promoValidating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">
                      {promoError}
                    </p>
                  )}
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

              {/* Submit */}
              <button
                type="button"
                onClick={handlePaymentConfirm}
                disabled={bookingSubmitting}
                className="hidden w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
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
                    Redirecting to Payment…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay &amp; Confirm
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
            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Promo discount
                </span>
                <span className="font-semibold">
                  − ৳{promoDiscount.toLocaleString()}
                </span>
              </div>
            )}
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
                ৳{advancePay.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Pay at property — 80%
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                  Due at check-in
                </p>
              </div>
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                ৳{balancePay.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fixed bottom bar ── */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95 lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Pay now (20%)
              </p>
              <p className="text-lg font-bold text-primary-700 dark:text-primary-300">
                ৳{advancePay.toLocaleString()}
              </p>
            </div>

            {step === "details" ? (
              <button
                type="button"
                onClick={() => {
                  if (guestFormRef.current) {
                    guestFormRef.current.requestSubmit();
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
              >
                Continue to Payment
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaymentConfirm}
                disabled={bookingSubmitting}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                    Redirecting…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay & Confirm
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
