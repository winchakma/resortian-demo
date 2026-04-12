"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Eye, EyeOff, Phone, Lock, User, Mail, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiLogin, apiRegister } from "@/utils/auth";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = yup.object({
  identifier: yup
    .string()
    .matches(/^01[3-9]\d{8}$/, "Enter a valid phone number")
    .required("Phone is required"),
  password: yup.string().required("Password is required"),
});

const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  phone: yup
    .string()
    .matches(/^01[3-9]\d{8}$/, "Enter a valid phone number")
    .required("Phone is required"),
  email: yup.string().email("Invalid email address").optional(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

type LoginData = yup.InferType<typeof loginSchema>;
type RegisterData = yup.InferType<typeof registerSchema>;

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Input styles ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary-400 dark:focus:bg-gray-900";

// ─── Login form ───────────────────────────────────────────────────────────────

function LoginForm({
  role,
  onSuccess,
}: {
  role: "USER" | "HOTEL_OWNER";
  onSuccess: () => void;
}) {
  const { setAuth } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: yupResolver(loginSchema) });

  async function onSubmit(data: LoginData) {
    setSubmitting(true);
    try {
      const res = await apiLogin(data);
      if (role !== "USER" && res.user.role === "USER") {
        toast.error("This account is not registered as a Hotel Owner.");
        return;
      }
      setAuth(res.user, res.accessToken);
      toast.success(`Welcome back, ${res.user.name}!`);
      onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Phone number" error={errors.identifier?.message}>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            {...register("identifier")}
            type="tel"
            placeholder="01XXXXXXXXX"
            className={inputCls}
          />
        </div>
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            className={`${inputCls} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPw ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

// ─── Register form ────────────────────────────────────────────────────────────

function RegisterForm({
  role,
  onSuccess,
}: {
  role: "USER" | "HOTEL_OWNER";
  onSuccess: () => void;
}) {
  const { setAuth } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({ resolver: yupResolver(registerSchema) });

  async function onSubmit(data: RegisterData) {
    setSubmitting(true);
    try {
      await apiRegister({
        name: data.name,
        phone: data.phone,
        password: data.password,
        email: data.email || undefined,
        role,
      });
      const res = await apiLogin({
        identifier: data.phone,
        password: data.password,
      });
      setAuth(res.user, res.accessToken);
      console.log({ res });
      setAuth(res.user, res.accessToken);
      toast.success(`Account created! Welcome, ${res?.user?.name}!`);
      onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Full name" error={errors.name?.message}>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            {...register("name")}
            type="text"
            placeholder="Your full name"
            className={inputCls}
          />
        </div>
      </Field>

      <Field label="Phone number" error={errors.phone?.message}>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            {...register("phone")}
            type="tel"
            placeholder="01XXXXXXXXX"
            className={inputCls}
          />
        </div>
      </Field>

      <Field label="Email address (optional)" error={errors.email?.message}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="At least 6 characters"
            className={`${inputCls} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPw ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </Field>

      <Field label="Confirm password" error={errors.confirmPassword?.message}>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            className={`${inputCls} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}

// ─── AuthForm (exported) ──────────────────────────────────────────────────────

interface AuthFormProps {
  role: "USER" | "HOTEL_OWNER";
}

export function AuthForm({ role }: AuthFormProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const router = useRouter();

  const isVendor = role === "HOTEL_OWNER";
  const switchHref = isVendor ? "/auth/customer" : "/auth/vendor";
  const switchLabel = isVendor
    ? "Sign in as Customer"
    : "Sign in as Hotel Owner";

  function handleSuccess() {
    router.push("/profile");
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isVendor
              ? "Hotel Owner Portal"
              : tab === "login"
                ? "Welcome back"
                : "Create an account"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isVendor
              ? "Manage your properties on Resortian"
              : "Book your perfect stay across Bangladesh"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Role badge */}
          <div className="mb-6 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isVendor
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
              }`}
            >
              <MapPin className="h-3 w-3" />
              {isVendor ? "Hotel Owner" : "Customer"}
            </span>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <LoginForm role={role} onSuccess={handleSuccess} />
          ) : (
            <RegisterForm role={role} onSuccess={handleSuccess} />
          )}
        </div>

        {/* Switch role link */}
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <Link
            href={switchHref}
            className="font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            {switchLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
