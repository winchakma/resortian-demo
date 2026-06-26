import { Header } from "@/sections/Header";
import { Hero, BangladeshStaysWithYou } from "@/sections/Hero";
import { Destinations } from "@/sections/Destinations";
import { FeaturedPlaces } from "@/sections/FeaturedPlaces";
import { UserStories } from "@/sections/UserStories";
import { FeaturedStays } from "@/sections/FeaturedStays";
import { Footer } from "@/sections/Footer";
import { Marquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Hero />
        <Marquee />
        <Destinations />
        <FeaturedStays />
        <FeaturedPlaces />
        <UserStories />
        <BangladeshStaysWithYou />
      </main>
      <Footer />
    </>
  );
}
