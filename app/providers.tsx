"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
      <CartProvider>
        {children}
        <Toaster
          position="bottom-right"
          gutter={12}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#111827",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              padding: "12px 16px",
              fontSize: "14px",
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
            },
            success: {
              iconTheme: { primary: "#34A853", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
