"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Hotel, Room } from "@/types";

interface BookRoomButtonProps {
  hotel: Hotel;
  room: Room;
}

export function BookRoomButton({ hotel, room }: BookRoomButtonProps) {
  const { addItem } = useCart();
  const router = useRouter();

  function handleBook() {
    addItem({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelSlug: hotel.slug,
      hotelLocation: hotel.location,
      roomId: room.id,
      roomName: room.name,
      roomImage: room.image,
      price: room.price,
      currency: hotel.currency,
      view: room.view,
      size: room.size,
      capacity: room.capacity,
    });

    toast.success(
      (t) => (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray-900">Added to cart!</p>
          <p className="text-xs text-gray-500">
            {room.name} &mdash; {hotel.name}
          </p>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              router.push("/cart");
            }}
            className="mt-1 self-start rounded-md bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700"
          >
            View Cart
          </button>
        </div>
      ),
      { duration: 5000 },
    );
  }

  return (
    <button
      onClick={handleBook}
      className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <ShoppingCart className="h-3.5 w-3.5" />
      Book Room
    </button>
  );
}
