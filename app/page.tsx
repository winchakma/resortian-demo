import { Header } from "@/sections/Header";
import { Hero, BangladeshStaysWithYou } from "@/sections/Hero";
import { Destinations } from "@/sections/Destinations";
import { FeaturedPlaces } from "@/sections/FeaturedPlaces";
import { UserStories } from "@/sections/UserStories";
import { FeaturedStays } from "@/sections/FeaturedStays";
import { Footer } from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Hero />
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
