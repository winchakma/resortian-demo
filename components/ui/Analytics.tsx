"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/gtag";

function PageViewTracker() {
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

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
