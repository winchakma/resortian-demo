"use client";

import { useEffect } from "react";

export function MobileHoverObserver() {
  useEffect(() => {
    // Only run on mobile (screens < 768px)
    if (typeof window === "undefined" || window.innerWidth >= 768) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-mobile-active", "true");
          } else {
            entry.target.removeAttribute("data-mobile-active");
          }
        });
      },
      {
        // Trigger when the element enters the middle 50% of the screen (horizontally and vertically)
        rootMargin: "-25% -25% -25% -25%",
        threshold: 0
      }
    );

    // Initial observation
    const observeCards = () => {
      document.querySelectorAll(".group, .group\\/card").forEach((el) => {
        if (!el.hasAttribute("data-observed")) {
          observer.observe(el);
          el.setAttribute("data-observed", "true");
        }
      });
    };

    observeCards();

    // Re-run observation if DOM changes (e.g., navigating to a different page)
    const mutObserver = new MutationObserver(() => observeCards());
    mutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObserver.disconnect();
    };
  }, []);

  return null;
}
