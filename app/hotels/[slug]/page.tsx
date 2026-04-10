import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Wifi,
  Wind,
  Waves,
  Dumbbell,
  Utensils,
  Car,
  Sparkles,
  Users,
  Maximize2,
  Eye,
} from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { Button } from "@/components/ui/Button";
import { ReviewForm } from "@/components/ui/ReviewForm";
import { getHotelBySlug, getHotelReviews } from "@/utils/api";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  Pool: <Waves className="h-4 w-4" />,
  WiFi: <Wifi className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
  Restaurant: <Utensils className="h-4 w-4" />,
  AC: <Wind className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Spa: <Sparkles className="h-4 w-4" />,
};

export default async function HotelDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [hotel, reviews] = await Promise.all([
    getHotelBySlug(slug),
    getHotelBySlug(slug).then((h) =>
      h ? getHotelReviews(h.id) : Promise.resolve([])
    ),
  ]);

  if (!hotel) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* ── Hero ── */}
        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Back nav */}
            <div className="flex items-center py-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Link>
            </div>

            {/* Two-column hero */}
            <div className="grid gap-8 pb-10 lg:grid-cols-[1fr_420px]">
              {/* Left: hotel image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md lg:aspect-auto lg:min-h-[460px]">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                {/* Tag badges */}
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {hotel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: hotel info */}
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  {hotel.name}
                </h1>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 text-primary-600" />
                  <span>{hotel.location}</span>
                </div>

                {/* Rating */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 dark:bg-amber-950/30">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                      {hotel.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({hotel.reviewCount} reviews)
                  </span>
                </div>

                {/* Description */}
                <p className="mt-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {hotel.description}
                </p>

                {/* Amenities */}
                <div className="mt-6">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Popular Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {AMENITY_ICONS[amenity] ?? null}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Starting price */}
                <div className="mt-8 rounded-xl border border-primary-100 bg-primary-50 px-5 py-4 dark:border-primary-900/30 dark:bg-primary-950/20">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
                    Starting from
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary-700 dark:text-primary-400">
                      ৳{Math.min(...hotel.rooms.map((r) => r.price)).toLocaleString()}
                    </span>
                    <span className="text-sm text-primary-600/70 dark:text-primary-500">
                      /night
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Select Your Room ── */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
              Select Your Room
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotel.rooms.map((room) => (
                <article
                  key={room.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                >
                  {/* Room image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {room.badge && (
                      <span className="absolute right-3 top-3 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow">
                        {room.badge}
                      </span>
                    )}
                  </div>

                  {/* Room details */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {room.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {room.description}
                    </p>

                    {/* Stats row */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary-500" />
                        {room.capacity}{" "}
                        {room.capacity === 1 ? "Guest" : "Guests"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="h-4 w-4 text-primary-500" />
                        {room.size}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4 text-primary-500" />
                        {room.view}
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {room.amenities.map((a) => (
                        <span
                          key={a}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        >
                          {a}
                        </span>
                      ))}
                    </div>

                    {/* Price + CTA */}
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            ৳{room.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            /night
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Taxes & fees included
                        </p>
                      </div>
                      <Button variant="primary" size="sm">
                        Book Room
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Guest Reviews ── */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-8 flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Guest Reviews
                </h2>
                <span className="ml-1 text-sm text-gray-400 dark:text-gray-500">
                  ({reviews.length})
                </span>
              </div>

              {/* Existing reviews */}
              {reviews.length > 0 ? (
                <div className="mb-8 space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50"
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.author}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(review.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-8 text-sm text-gray-400 dark:text-gray-500">
                  No reviews yet. Be the first to review!
                </p>
              )}

              {/* Write a review */}
              <div>
                <h3 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
                  Write a Review
                </h3>
                <ReviewForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
