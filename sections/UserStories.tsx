"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, ArrowRight } from "lucide-react";

interface Story {
  id: string;
  quote: string;
  image: string;
  author: string;
  avatar: string;
}

const STORIES: Story[] = [
  {
    id: "1",
    quote: "Saint Martin Paradise Resort! Go Crazy at the Blue Water Beach Resort",
    image: "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=600&h=450&fit=crop",
    author: "zayan_rahman_explorer",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    quote: "Slow Healing Trip at Srimangal Tea Garden Escape 💚",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=450&fit=crop",
    author: "nabila_karim_local_guide",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    quote: "Nilgiri Hills Bandarban - watching clouds float below our balcony",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=450&fit=crop",
    author: "faisal_ahmed_backpacker",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    quote: "Venture deep into Sundarbans mangroves - Royal Bengal spotting!",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=450&fit=crop",
    author: "sadia_islam_wildlife",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    quote: "A perfect weekend getaway at Kuakata - watched both sunrise and sunset!",
    image: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=600&h=450&fit=crop",
    author: "arif_hossain_travels",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "6",
    quote: "Mesmerizing waterfalls in Khagrachari, truly a hidden gem of Bangladesh 🌊",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=450&fit=crop",
    author: "nusrat_jahan_diaries",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
];

const HOVER_THEMES = [
  { borderClass: "hover:border-[#FF385C] border-white/5", textClass: "text-[#FF385C]", hoverTextClass: "group-hover/card:text-[#FF385C]", iconBorderClass: "group-hover/card:border-[#FF385C]", buttonHoverClass: "group-hover/card:bg-[#FF385C] group-hover/card:text-white" }, // Coral
  { borderClass: "hover:border-[#0D9488] border-white/5", textClass: "text-[#0D9488]", hoverTextClass: "group-hover/card:text-[#0D9488]", iconBorderClass: "group-hover/card:border-[#0D9488]", buttonHoverClass: "group-hover/card:bg-[#0D9488] group-hover/card:text-white" }, // Teal
  { borderClass: "hover:border-[#D4A574] border-white/5", textClass: "text-[#D4A574]", hoverTextClass: "group-hover/card:text-[#D4A574]", iconBorderClass: "group-hover/card:border-[#D4A574]", buttonHoverClass: "group-hover/card:bg-[#D4A574] group-hover/card:text-gray-900" }, // Gold
  { borderClass: "hover:border-[#34A853] border-white/5", textClass: "text-[#34A853]", hoverTextClass: "group-hover/card:text-[#34A853]", iconBorderClass: "group-hover/card:border-[#34A853]", buttonHoverClass: "group-hover/card:bg-[#34A853] group-hover/card:text-white" }, // Green
];

export function UserStories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-3 sm:py-5 dark:bg-gray-950 overflow-hidden">
      {/* Dark overlay with emerald tint behind slider */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Real Stories. Unforgettable Moments.
            </h2>
            <p className="mt-3 text-lg text-primary-100">
              See how travelers share their unforgettable moments
            </p>
          </div>
          <Link
            href="/stories"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-200 hover:text-white transition-colors"
          >
            More
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Slider Container */}
        <div className="relative group">
          {/* Scrollable Area */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-4 -mt-4 px-2 -mx-2 scroll-px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {STORIES.map((story, index) => {
              const theme = HOVER_THEMES[index % HOVER_THEMES.length];
              
              return (
                <div
                  key={story.id}
                  className="w-[280px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start snap-always"
                >
                  <Link href="/stories" className="block h-full cursor-pointer">
                    <div className={`group/card relative flex flex-col justify-end overflow-hidden rounded-3xl border-2 bg-gray-900 shadow-xl transition-all duration-500 hover:-translate-y-2 h-[420px] ${theme.borderClass}`}>

                      {/* Background Image - Comes to life on hover */}
                      <Image
                        src={story.image}
                        alt={story.quote}
                        fill
                        unoptimized
                        className="object-cover grayscale opacity-50 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-700 group-hover/card:scale-105"
                        sizes="(max-width: 640px) 280px, 25vw"
                      />

                      {/* Top Left: Author Info (Matching Gym's Time/Intensity placement) */}
                      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/20 shrink-0">
                            <Image
                              src={story.avatar}
                              alt={story.author}
                              fill
                              unoptimized
                              className="object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700"
                              sizes="28px"
                            />
                          </div>
                          <span className={`text-xs font-bold tracking-wide uppercase transition-colors duration-500 drop-shadow-md ${theme.textClass}`}>
                            @{story.author}
                          </span>
                        </div>
                      </div>

                      {/* Top Right Icon */}
                      <div className={`absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-colors duration-500 ${theme.iconBorderClass}`}>
                        <Quote className={`h-4 w-4 text-white transition-colors duration-500 ${theme.hoverTextClass}`} />
                      </div>

                      {/* Bottom Content Panel */}
                      <div className="relative z-20 p-5 flex flex-col justify-end h-full">
                        
                        {/* The Paragraph (Stays Crisp White, acting like the Class Name in Gym) */}
                        <p className="text-xl font-extrabold leading-tight text-white mb-5 drop-shadow-lg">
                          "{story.quote}"
                        </p>

                        {/* Frosted Glass Action Button (Fills with color on hover, matching Gym 'BOOK SESSION') */}
                        <div className={`flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md py-3 text-xs font-black tracking-widest uppercase transition-all duration-500 group-hover/card:border-transparent ${theme.textClass} ${theme.buttonHoverClass}`}>
                          READ STORY <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Gradient Overlay for Readability (Heavy at bottom, matching Gym) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 pointer-events-none z-10 group-hover/card:via-black/50 transition-colors duration-700" />

                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons — exact same style as FeaturedPlaces */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all hover:bg-gray-50 hover:scale-105 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all hover:bg-gray-50 hover:scale-105 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
