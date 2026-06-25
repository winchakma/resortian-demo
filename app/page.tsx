import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { FeaturedStays } from "@/sections/FeaturedStays";
import { BestTimeToBook } from "@/sections/BestTimeToBook";
import { PopularDestinations } from "@/sections/PopularDestinations";
import { WhyChooseUs } from "@/sections/WhyChooseUs";
import { GetTheApp } from "@/sections/GetTheApp";
import { Footer } from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedStays />
        <BestTimeToBook />
        <PopularDestinations />
        <WhyChooseUs />
        {/* <GetTheApp /> */}
      </main>
      <Footer />
    </>
  );
}
