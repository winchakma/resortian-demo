"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { apiMe } from "@/utils/auth";

function CallbackHandler() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const accessToken = searchParams.get("accessToken");
    const error = searchParams.get("error");

    async function handle() {
      if (error || !accessToken) {
        toast.error("Google sign-in failed. Please try again.");
        router.replace("/auth/customer");
        return;
      }

      try {
        const user = await apiMe(accessToken);
        setAuth(user, accessToken);
        // Clean the token from the URL before redirecting
        router.replace("/");
        toast.success(`Welcome, ${user.name}!`);
      } catch {
        toast.error("Failed to complete sign-in. Please try again.");
        router.replace("/auth/customer");
      }
    }

    handle();
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Completing sign-in…
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
