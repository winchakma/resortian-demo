"use client";

import { memo } from "react";

const WORDS = [
  "Unrivaled Luxury",
  "Pristine Beaches",
  "Serene Retreats",
  "Unforgettable Journeys",
  "Exclusive Getaways",
  "World-Class Hospitality",
  "Tropical Paradise",
  "Breathtaking Views",
];

// Duplicate words to ensure the marquee spans wide enough before looping
const MARQUEE_CONTENT = [...WORDS, ...WORDS, ...WORDS, ...WORDS];

export const Marquee = memo(function Marquee() {
  return (
    <div className="relative w-full overflow-hidden bg-transparent py-4 sm:py-6 select-none">
      <div className="flex w-max animate-marquee items-center">
        {MARQUEE_CONTENT.map((word, index) => (
          <div key={index} className="flex items-center">
            <span
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wider text-gray-200 dark:text-gray-800 whitespace-nowrap"
            >
              {word}
            </span>
            <span className="mx-6 sm:mx-10 lg:mx-12 text-xl sm:text-2xl text-gray-200 dark:text-gray-800">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

Marquee.displayName = "Marquee";
