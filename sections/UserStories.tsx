"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

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
  { shadowClass: "hover:shadow-[0_12px_40px_rgba(255,56,92,0.35)]", textClass: "group-hover/card:text-[#FF385C]" }, // Coral
  { shadowClass: "hover:shadow-[0_12px_40px_rgba(13,148,136,0.35)]", textClass: "group-hover/card:text-[#0D9488]" }, // Teal
  { shadowClass: "hover:shadow-[0_12px_40px_rgba(52,168,83,0.35)]", textClass: "group-hover/card:text-[#34A853]" }, // Green
  { shadowClass: "hover:shadow-[0_12px_40px_rgba(212,165,116,0.35)]", textClass: "group-hover/card:text-[#D4A574]" }, // Gold
];

export function UserStories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

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

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
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
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-4 -mt-4 px-2 -mx-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {STORIES.map((story, index) => {
              const isFav = !!favorites[story.id];
              const theme = HOVER_THEMES[index % HOVER_THEMES.length];
              
              return (
                <div
                  key={story.id}
                  className="w-[260px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start snap-always"
                >
                  <Link href="/stories" className="block h-full cursor-pointer">
                    <div className={`group/card relative flex flex-col overflow-hidden rounded-3xl premium-glass shadow-xl transition-all duration-500 hover:-translate-y-2 h-full ${theme.shadowClass}`}>

                      {/* Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={story.image}
                          alt={story.quote}
                          fill
                          unoptimized
                          className="object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700 group-hover/card:scale-105"
                          sizes="(max-width: 640px) 260px, 25vw"
                        />

                        {/* Favorite Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(story.id, e)}
                          aria-label="Like story"
                          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-black shadow-md transition hover:bg-white hover:scale-110 active:scale-95 dark:bg-slate-900/95 dark:text-gray-300 dark:hover:bg-slate-900"
                        >
                          <Heart
                            fill={isFav ? "currentColor" : "none"}
                            className={`h-4 w-4 transition-colors pointer-events-none ${
                              isFav ? "text-coral-500" : "text-gray-400 group-hover/card:text-coral-400"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content Panel */}
                      <div className="p-4 flex flex-col gap-3">
                        <p className={`text-[14px] font-extrabold leading-snug text-black dark:text-white line-clamp-2 transition-colors duration-500 ${theme.textClass}`}>
                          {story.quote}
                        </p>
                        {/* Author */}
                        <div className="flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                          <div className="relative h-6 w-6 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 shrink-0">
                            <Image
                              src={story.avatar}
                              alt={story.author}
                              fill
                              unoptimized
                              className="object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700"
                              sizes="24px"
                            />
                          </div>
                          <span className="text-xs font-semibold text-black dark:text-gray-300 truncate transition-colors duration-500">
                            {story.author}
                          </span>
                        </div>
                      </div>

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
