"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/gtag";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip the very first render — the GA script fires the initial pageview itself
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
