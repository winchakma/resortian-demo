export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;
  window.gtag("config", GA_ID, { page_path: url });
}

// ── Typed event catalogue ─────────────────────────────────────────────────────

type EventParams = {
  search_hotels: {
    location: string;
    check_in?: string;
    check_out?: string;
    adults?: number;
    rooms?: number;
  };
  view_hotel: {
    hotel_id: string;
    hotel_name: string;
    location: string;
    price: number;
  };
  select_room: {
    hotel_id: string;
    hotel_name: string;
    room_id: string;
    room_name: string;
    price: number;
  };
  begin_booking: {
    hotel_id: string;
    hotel_name: string;
    value: number;
    currency?: string;
  };
  complete_booking: {
    transaction_id: string;
    hotel_id: string;
    hotel_name: string;
    value: number;
    currency?: string;
  };
  login: { method: string };
  signup: { method: string };
};

export function trackEvent<T extends keyof EventParams>(
  name: T,
  params: EventParams[T],
) {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;
  window.gtag("event", name, params);
}
