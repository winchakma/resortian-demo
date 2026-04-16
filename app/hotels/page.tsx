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
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    amenities?: string;
    tags?: string;
    page?: string;
  }>;
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const p = await searchParams;

  const { data: hotels, meta } = await getHotels({
    location: p.location,
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    adults: p.adults ? Number(p.adults) : undefined,
    children: p.children ? Number(p.children) : undefined,
    rooms: p.rooms ? Number(p.rooms) : undefined,
    sortBy: p.sortBy,
    minPrice: p.minPrice ? Number(p.minPrice) : undefined,
    maxPrice: p.maxPrice ? Number(p.maxPrice) : undefined,
    minRating: p.minRating ? Number(p.minRating) : undefined,
    amenities: p.amenities ? p.amenities.split(",") : undefined,
    tags: p.tags ? p.tags.split(",") : undefined,
    page: p.page ? Number(p.page) : 1,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <HotelsContent hotels={hotels} meta={meta} searchParams={p} />
      </main>
      <Footer />
    </>
  );
}
