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
    <section className="bg-gray-50 py-4 dark:bg-gray-900/40 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Magical trip moments that last
          </h2>
          <Link
            href="/stories"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
          >
            More
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Slider Container — same structure as FeaturedPlaces */}
        <div className="relative group">
          {/* Scrollable Area */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {STORIES.map((story) => {
              const isFav = !!favorites[story.id];
              return (
                <div
                  key={story.id}
                  className="w-[280px] sm:w-[300px] shrink-0 snap-start snap-always"
                >
                  <Link href="/stories" className="block h-full cursor-pointer">
                    <div className="group/card relative flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-md dark:border-white/5 dark:bg-slate-900/60 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">

                      {/* Image — same 4:3 landscape ratio as FeaturedPlaces */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={story.image}
                          alt={story.quote}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                          sizes="(max-width: 640px) 280px, 300px"
                        />

                        {/* Favorite Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(story.id, e)}
                          aria-label="Like story"
                          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-500 shadow-md transition hover:bg-white hover:scale-110 active:scale-95 dark:bg-slate-900/95 dark:text-gray-300 dark:hover:bg-slate-900"
                        >
                          <Heart
                            fill={isFav ? "currentColor" : "none"}
                            className={`h-4 w-4 transition-colors pointer-events-none ${
                              isFav ? "text-red-500" : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content Panel — below image, same as FeaturedPlaces */}
                      <div className="p-4 flex flex-col gap-3">
                        <p className="text-[14px] font-extrabold leading-snug text-gray-900 dark:text-white line-clamp-2 group-hover/card:text-primary-600 transition-colors">
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
                              className="object-cover"
                              sizes="24px"
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-150 bg-white/95 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-black hover:scale-105 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-150 bg-white/95 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-black hover:scale-105 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
