"use client";

import Image from "next/image";
import { Users, Maximize2, Eye } from "lucide-react";
import { BookRoomButton } from "@/components/ui/BookRoomButton";
import { useCart } from "@/context/CartContext";
import type { Room, Hotel } from "@/types";

interface RoomCardProps {
  room: Room;
  hotel: Hotel;
}

export function RoomCard({ room, hotel }: RoomCardProps) {
  const { items } = useCart();

  // Check if this specific room is already in cart
  const isInCart = items.some(
    (item) => item.roomId === room.id && item.hotelId === hotel.id,
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      {/* Room image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          unoptimized
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
        <h3 className="font-semibold text-black dark:text-white">
          {room.name}
        </h3>
        <p className="mt-1 text-sm text-black dark:text-gray-400">
          {room.description}
        </p>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4 text-sm text-black dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-primary-500" />
            {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
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
          {room.amenities.map((a: string) => (
            <span
              key={a}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-black dark:bg-gray-800 dark:text-gray-400"
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
              <span className="text-xs text-black dark:text-gray-400">
                /night
              </span>
            </div>
            <p className="text-xs text-black dark:text-gray-500">
              Taxes & fees included
            </p>
          </div>
          {isInCart ? (
            <button
              disabled
              className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-black cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
            >
              Already in Cart
            </button>
          ) : (
            <BookRoomButton hotel={hotel} room={room} />
          )}
        </div>
      </div>
    </article>
  );
}
