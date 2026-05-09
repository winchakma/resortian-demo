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
  LogIn,
  LogOut,
  FileText,
} from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { BookRoomButton } from "@/components/ui/BookRoomButton";
import { HotelReviewsSection } from "@/components/ui/HotelReviewsSection";
import { getHotelBySlug, getHotelReviews } from "@/utils/api";
import { RoomCard } from "@/components/ui/RoomCard";

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
      h ? getHotelReviews(h.id) : Promise.resolve([]),
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
                  unoptimized
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
                <div
                  className="prose prose-sm mt-5 max-w-none text-gray-600 dark:text-gray-400 [&_b]:font-semibold [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal"
                  dangerouslySetInnerHTML={{ __html: hotel.description }}
                />

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
                      ৳{hotel.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-primary-600/70 dark:text-primary-500">
                      /night
                    </span>
                  </div>
                </div>

                {/* Check-in / Check-out times */}
                {(hotel.checkinTime || hotel.checkoutTime) && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {hotel.checkinTime && (
                      <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800/60">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/40">
                          <LogIn className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Check-in</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {hotel.checkinTime}
                          </p>
                        </div>
                      </div>
                    )}
                    {hotel.checkoutTime && (
                      <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800/60">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40">
                          <LogOut className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Check-out</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {hotel.checkoutTime}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                <RoomCard key={room.id} room={room} hotel={hotel} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Booking Conditions ── */}
        {hotel.bookingConditions && (
          <section className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-8">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
                    <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Booking Conditions
                  </h2>
                </div>
                <div
                  className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400 [&_b]:font-semibold [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal"
                  dangerouslySetInnerHTML={{ __html: hotel.bookingConditions }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ── Guest Reviews ── */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <HotelReviewsSection reviews={reviews} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
