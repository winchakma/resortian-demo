import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { DestinationsContent } from "@/components/ui/DestinationsContent";
import { getDestinations } from "@/utils/api";

export const metadata: Metadata = {
  title: "Destinations | Resortian",
  description:
    "Explore the most beautiful travel destinations across Bangladesh — from sea beaches and hill tracts to mangrove forests and coral islands.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <DestinationsContent destinations={destinations} />
      </main>
      <Footer />
    </>
  );
}
