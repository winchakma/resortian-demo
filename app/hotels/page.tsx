import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { HotelsContent } from "@/components/ui/HotelsContent";
import { getHotels } from "@/utils/api";

export const metadata: Metadata = {
  title: "Properties | Resortian",
  description:
    "Browse and book the best properties across Bangladesh — Cox's Bazar, Sylhet, Bandarban, Sundarbans & more.",
};

interface HotelsPageProps {
  searchParams: Promise<{
    location?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    rooms?: string;
    sortBy?: string;
  }>;
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const p = await searchParams;

  // TODO: pass params to getHotels() once real API is connected
  const hotels = await getHotels({
    location: p.location,
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    adults: p.adults ? Number(p.adults) : undefined,
    children: p.children ? Number(p.children) : undefined,
    rooms: p.rooms ? Number(p.rooms) : undefined,
    sortBy: p.sortBy,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <HotelsContent hotels={hotels} searchParams={p} />
      </main>
      <Footer />
    </>
  );
}
