import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import { Analytics } from "@/components/ui/Analytics";
import { GA_ID } from "@/lib/gtag";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Resortian - Premium Resort & Hotel Booking in Bangladesh",
  description:
    "Find and book premium hotels, resorts, and homestays across the most beautiful destinations in Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${outfit.variable} h-full overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        {GA_ID && process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        )}
        <Providers>
          <Analytics />
          {children}
        </Providers>
      </body>
    </html>
  );
}
