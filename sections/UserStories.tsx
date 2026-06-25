import Image from "next/image";
import { User } from "lucide-react";

interface Story {
  id: string;
  title: string;
  quote: string;
  image: string;
  author: string;
  role: string;
}

const STORIES: Story[] = [
  {
    id: "1",
    title: "Saint Martin Paradise",
    quote: "Waking up to the sound of waves on Saint Martin Coral Island was absolutely magical. The water is so blue!",
    image: "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=600&h=800&fit=crop",
    author: "Zayan Rahman",
    role: "Explorer • 12 reviews",
  },
  {
    id: "2",
    title: "Sylhet Tea Garden Escape",
    quote: "Strolling through the misty Srimangal tea valleys during sunrise felt like a dream. Highly recommend!",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=800&fit=crop",
    author: "Nabila Karim",
    role: "Local Guide • 45 reviews",
  },
  {
    id: "3",
    title: "Trekking Bandarban Peak",
    quote: "The view from Nilgiri Hills is breathtaking. Watching the clouds float below our hotel room was unforgettable.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=800&fit=crop",
    author: "Faisal Ahmed",
    role: "Backpacker • 8 reviews",
  },
  {
    id: "4",
    title: "Sundarbans Boat Cruise",
    quote: "Venture deep into the mangroves. Spotting a swimming Bengal Tiger from our cabin deck was a core memory.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=800&fit=crop",
    author: "Sadia Islam",
    role: "Wildlife Fan • 21 reviews",
  },
];

export function UserStories() {
  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900/40 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Magical trip moments that last
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              See how travelers share their unforgettable moments in Bangladesh
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {STORIES.map((story) => (
              <div
                key={story.id}
                className="w-[260px] sm:w-[300px] shrink-0 snap-start snap-always"
              >
                <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-3xl shadow-md transition-shadow hover:shadow-xl">
                  {/* Background Image */}
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 260px, 300px"
                  />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Top Quote Tag */}
                  <div className="absolute left-4 top-4 rounded-lg bg-emerald-600/90 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                    {story.title}
                  </div>

                  {/* Bottom Text Overlays */}
                  <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col gap-4">
                    <p className="text-sm font-medium leading-relaxed italic text-gray-100 line-clamp-3">
                      &ldquo;{story.quote}&rdquo;
                    </p>

                    {/* Author Avatar & Name */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-white/10">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{story.author}</p>
                        <p className="text-[10px] text-gray-300 truncate mt-0.5">{story.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
