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
    <div className="relative w-full overflow-hidden bg-transparent py-10 sm:py-16 md:py-20 select-none">
      {/* 
        We use flex w-max to allow the content to stretch as far as it needs,
        and animate-marquee from our globals.css to continuously slide it left.
      */}
      <div className="flex w-max animate-marquee items-center">
        {MARQUEE_CONTENT.map((word, index) => (
          <div key={index} className="flex items-center">
            {/* 
              We use Playfair Display (font-serif), make it massive,
              and apply a CSS text stroke for that premium "outline" texture.
              The text fill is transparent.
            */}
            <span
              className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black uppercase tracking-wider text-transparent whitespace-nowrap"
              style={{
                WebkitTextStroke: "1px var(--color-foreground)",
                opacity: 0.1, // extremely faint, elegant watermark texture
              }}
            >
              {word}
            </span>
            <span className="mx-8 sm:mx-16 lg:mx-20 text-3xl sm:text-5xl opacity-10 text-black dark:text-white">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

Marquee.displayName = "Marquee";
