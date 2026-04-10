"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LogIn,
  User,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
  Lock,
  CheckCircle2,
  ShoppingBag,
  ChevronRight,
  Eye,
  EyeOff,
  Smartphone,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type AuthMode = "login" | "guest";
type PaymentMethod = "stripe" | "uddoktapay";
type Step = "details" | "payment" | "confirmed";

const TAX_RATE = 0.05;

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

const stripeSchema = yup.object({
  cardNumber: yup
    .string()
    .required("Card number is required")
    .test("card-length", "Enter a valid 16-digit card number", (v) =>
      /^[\d ]{19}$/.test(v ?? ""),
    ),
  cardName: yup.string().required("Cardholder name is required"),
  cardExpiry: yup
    .string()
    .required("Expiry date is required")
    .matches(/^\d{2}\/\d{2}$/, "Enter expiry in MM/YY format"),
  cardCvc: yup
    .string()
    .required("CVC is required")
    .matches(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
});

const uddoktaSchema = yup.object({
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(
      BD_PHONE_REGEX,
      "Enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX)",
    ),
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
type StripeFormValues = yup.InferType<typeof stripeSchema>;
type UddoktaFormValues = yup.InferType<typeof uddoktaSchema>;

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

export function CheckoutContent() {
  const { items, totalAmount, clearCart } = useCart();
  // const taxes = Math.round(totalAmount * TAX_RATE);
  const grandTotal = totalAmount;

  const [authMode, setAuthMode] = useState<AuthMode>("guest");
  const [step, setStep] = useState<Step>("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [showPassword, setShowPassword] = useState(false);

  // ── Forms ─────────────────────────────────────────────────────────────────
  const loginForm = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  const guestForm = useForm<GuestFormValues>({
    resolver: yupResolver(guestSchema) as Resolver<GuestFormValues>,
    mode: "onTouched",
  });

  const stripeForm = useForm<StripeFormValues>({
    resolver: yupResolver(stripeSchema),
    mode: "onTouched",
  });

  const uddoktaForm = useForm<UddoktaFormValues>({
    resolver: yupResolver(uddoktaSchema),
    mode: "onTouched",
  });

  // ── Card preview values (watch for live preview) ──────────────────────────
  const watchedCardNumber = stripeForm.watch("cardNumber") ?? "";
  const watchedCardName = stripeForm.watch("cardName") ?? "";
  const watchedCardExpiry = stripeForm.watch("cardExpiry") ?? "";

  // ── Format helpers ────────────────────────────────────────────────────────
  function formatCardNumber(val: string) {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(val: string) {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    return cleaned.length > 2
      ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
      : cleaned;
  }

  // ── Submit handlers ───────────────────────────────────────────────────────
  function handleGuestDetailsNext(data: GuestFormValues) {
    void data; // data is validated — proceed
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLoginSubmit(data: LoginFormValues) {
    void data;
    // TODO: call real login API
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStripeSubmit(data: StripeFormValues) {
    void data;
    setStep("confirmed");
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleUddoktaSubmit(data: UddoktaFormValues) {
    void data;
    setStep("confirmed");
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Confirmed ─────────────────────────────────────────────────────────────
  if (step === "confirmed") {
    const ref = Math.random().toString(36).slice(2, 8).toUpperCase();
    return (
      <div className="flex min-h-[70vh] items-center justify-center py-20">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950/40">
            <CheckCircle2 className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking Confirmed!
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Your reservation has been placed successfully. A confirmation email
            has been sent to your inbox.
          </p>
          <div className="mt-8 rounded-2xl border border-primary-100 bg-primary-50 p-6 text-left dark:border-primary-900/30 dark:bg-primary-950/20">
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">
              Booking Reference
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-white">
              RST-{ref}
            </p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Please keep this reference for your records. Our team will contact
              you within 24 hours to confirm the details.
            </p>
          </div>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700"
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
              {/* Auth toggle card */}
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
                        message={loginForm.formState.errors.loginPhone?.message}
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
                      className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      Sign In
                    </button>

                    <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                      Don&apos;t have an account?{" "}
                      <a
                        href="#"
                        className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Create one
                      </a>
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
                    <div className="sm:col-span-2">
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
                    </div>
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
            <div className="space-y-6">
              {/* Payment method selector */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Select Payment Method
                  </h2>
                </div>
                <div className="grid gap-3 p-6 sm:grid-cols-2">
                  {/* Stripe option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                      paymentMethod === "stripe"
                        ? "border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-950/30"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                    }`}
                  >
                    {paymentMethod === "stripe" && (
                      <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-primary-600 dark:text-primary-400" />
                    )}
                    <div className="flex h-10 w-full items-center justify-center rounded-lg bg-[#635BFF] px-4">
                      <svg
                        viewBox="0 0 60 25"
                        fill="none"
                        className="h-5"
                        aria-label="Stripe"
                      >
                        <path
                          d="M5.45 10.17c0-.76.63-1.06 1.66-1.06 1.48 0 3.36.45 4.84 1.25V6.33C10.4 5.7 8.84 5.45 7.11 5.45 3.26 5.45 0.7 7.43 0.7 10.4c0 4.57 6.3 3.84 6.3 5.81 0 .9-.78 1.19-1.86 1.19-1.61 0-3.67-.67-5.3-1.56v4.09c1.8.78 3.62 1.1 5.3 1.1 4.04 0 6.71-2 6.71-5 0-4.93-6.4-4.06-6.4-5.86zm11.56-7.3L12.53 3.8l-.02 14.6 4.5.01V2.87zm9.14 14.48c-1.25 0-2.1-.57-2.1-1.93 0-1.43.85-1.96 2.1-1.96.69 0 1.37.17 1.93.46V12.6a6.54 6.54 0 00-2-.31c-3.31 0-5.5 1.76-5.5 4.7 0 2.88 2.12 4.63 5.38 4.63.76 0 1.47-.09 2.12-.27v-3.26a4.72 4.72 0 01-1.93.46zm9.67-8.87c-.76 0-1.48.23-2.07.64V3.8l-4.47 1.08v15.53h4.47v-8.18c.55-.37 1.17-.6 1.84-.6 1.38 0 1.84.9 1.84 2.27v6.51h4.49v-7.41c0-2.8-1.64-4.52-4.1-4.52zm15.95 1.1c-.67-1.46-1.97-2.23-3.7-2.23-3.13 0-5.1 2.44-5.1 5.86 0 3.78 2.17 5.62 5.28 5.62 1.48 0 2.74-.44 3.75-1.22l.23 1h4.02V8.4h-4.02l-.46 1.18zm-2.68 7.02c-1.22 0-1.89-.85-1.89-2.41 0-1.53.69-2.41 1.89-2.41.67 0 1.24.3 1.62.76v3.3a2.2 2.2 0 01-1.62.76z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="w-full text-center">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Credit / Debit Card
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Visa, Mastercard, Amex
                      </p>
                    </div>
                  </button>

                  {/* UddoktaPay option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("uddoktapay")}
                    className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                      paymentMethod === "uddoktapay"
                        ? "border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-950/30"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                    }`}
                  >
                    {paymentMethod === "uddoktapay" && (
                      <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-primary-600 dark:text-primary-400" />
                    )}
                    <div className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-4">
                      <Smartphone className="h-5 w-5 text-white" />
                      <span className="text-sm font-bold text-white">
                        UddoktaPay
                      </span>
                    </div>
                    <div className="w-full text-center">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Mobile Banking
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        bKash, Nagad, Rocket
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* ── Stripe form ── */}
              {paymentMethod === "stripe" && (
                <form
                  onSubmit={stripeForm.handleSubmit(handleStripeSubmit)}
                  noValidate
                  className="space-y-6"
                >
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        Card Details
                      </h2>
                    </div>
                    <div className="space-y-5 p-6">
                      {/* Visual card preview */}
                      <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 p-6 shadow-lg">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10" />
                        <div className="relative">
                          <p className="text-xs font-medium uppercase tracking-widest text-primary-100">
                            Resortian Pay
                          </p>
                          <p className="mt-6 font-mono text-lg tracking-widest text-white">
                            {watchedCardNumber || "•••• •••• •••• ••••"}
                          </p>
                          <div className="mt-4 flex items-end justify-between">
                            <div>
                              <p className="text-[10px] uppercase text-primary-200">
                                Cardholder
                              </p>
                              <p className="text-sm font-medium text-white">
                                {watchedCardName || "YOUR NAME"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase text-primary-200">
                                Expires
                              </p>
                              <p className="text-sm font-medium text-white">
                                {watchedCardExpiry || "MM/YY"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Number */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="1234 5678 9012 3456"
                            {...stripeForm.register("cardNumber")}
                            onChange={(e) =>
                              stripeForm.setValue(
                                "cardNumber",
                                formatCardNumber(e.target.value),
                                { shouldValidate: true },
                              )
                            }
                            className={`${inputCls(!!stripeForm.formState.errors.cardNumber)} pl-10 pr-4 font-mono`}
                          />
                        </div>
                        <FieldError
                          message={
                            stripeForm.formState.errors.cardNumber?.message
                          }
                        />
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="AHMED RAHMAN"
                          {...stripeForm.register("cardName")}
                          onChange={(e) =>
                            stripeForm.setValue(
                              "cardName",
                              e.target.value.toUpperCase(),
                              { shouldValidate: true },
                            )
                          }
                          className={`${inputCls(!!stripeForm.formState.errors.cardName)} px-4 font-mono`}
                        />
                        <FieldError
                          message={
                            stripeForm.formState.errors.cardName?.message
                          }
                        />
                      </div>

                      {/* Expiry + CVC */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            {...stripeForm.register("cardExpiry")}
                            onChange={(e) =>
                              stripeForm.setValue(
                                "cardExpiry",
                                formatExpiry(e.target.value),
                                { shouldValidate: true },
                              )
                            }
                            className={`${inputCls(!!stripeForm.formState.errors.cardExpiry)} px-4 font-mono`}
                          />
                          <FieldError
                            message={
                              stripeForm.formState.errors.cardExpiry?.message
                            }
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            CVC
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="•••"
                              {...stripeForm.register("cardCvc")}
                              onChange={(e) =>
                                stripeForm.setValue(
                                  "cardCvc",
                                  e.target.value.replace(/\D/g, "").slice(0, 4),
                                  { shouldValidate: true },
                                )
                              }
                              className={`${inputCls(!!stripeForm.formState.errors.cardCvc)} pl-10 pr-4 font-mono`}
                            />
                          </div>
                          <FieldError
                            message={
                              stripeForm.formState.errors.cardCvc?.message
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security notice */}
                  <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <Lock className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Your payment is secured with 256-bit SSL encryption. We
                      never store your card details.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
                  >
                    <Lock className="h-4 w-4" />
                    Complete Booking — ৳{grandTotal.toLocaleString()}
                  </button>
                </form>
              )}

              {/* ── UddoktaPay form ── */}
              {paymentMethod === "uddoktapay" && (
                <form
                  onSubmit={uddoktaForm.handleSubmit(handleUddoktaSubmit)}
                  noValidate
                  className="space-y-6"
                >
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        Mobile Payment Details
                      </h2>
                    </div>
                    <div className="space-y-5 p-6">
                      <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950/20">
                        <p className="text-sm font-medium text-green-800 dark:text-green-400">
                          You will be redirected to UddoktaPay to complete your
                          payment securely.
                        </p>
                        <p className="mt-1 text-xs text-green-700 dark:text-green-500">
                          Supports bKash, Nagad, Rocket, and all major mobile
                          banking services in Bangladesh.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {(
                          [
                            { name: "bKash", color: "bg-[#e2136e]" },
                            { name: "Nagad", color: "bg-[#f55f14]" },
                            { name: "Rocket", color: "bg-[#8b3fc7]" },
                          ] as const
                        ).map((p) => (
                          <div
                            key={p.name}
                            className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                          >
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${p.color}`}
                            >
                              {p.name[0]}
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {p.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            {...uddoktaForm.register("mobileNumber")}
                            placeholder="01XXXXXXXXX"
                            className={`${inputCls(!!uddoktaForm.formState.errors.mobileNumber)} pl-10 pr-4`}
                          />
                        </div>
                        <FieldError
                          message={
                            uddoktaForm.formState.errors.mobileNumber?.message
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security notice */}
                  <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <Lock className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Your payment is secured with 256-bit SSL encryption. We
                      never store your card details.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
                  >
                    <Lock className="h-4 w-4" />
                    Complete Booking — ৳{grandTotal.toLocaleString()}
                  </button>
                </form>
              )}
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
                </div>
                <p className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
                  ৳{item.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="my-5 border-t border-gray-100 dark:border-gray-800" />

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>৳{totalAmount.toLocaleString()}</span>
            </div>
            {/* <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>VAT (5%)</span>
              <span>৳{taxes.toLocaleString()}</span>
            </div> */}
            <div className="flex justify-between text-gray-500 dark:text-gray-500">
              <span>Service fee</span>
              <span className="text-primary-600 dark:text-primary-400">
                Free
              </span>
            </div>
          </div>

          <div className="my-5 border-t border-gray-100 dark:border-gray-800" />

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 dark:text-white">
              Total
            </span>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ৳{grandTotal.toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-right text-xs text-gray-400 dark:text-gray-500">
            Includes all taxes &amp; fees
          </p>
        </div>
      </div>
    </div>
  );
}
