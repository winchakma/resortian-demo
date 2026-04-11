"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Hotel, Room } from "@/types";
import { BookingModal } from "@/components/ui/BookingModal";

interface BookRoomButtonProps {
  hotel: Hotel;
  room: Room;
}

export function BookRoomButton({ hotel, room }: BookRoomButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        Book Room
      </button>

      {isModalOpen && (
        <BookingModal
          hotel={hotel}
          room={room}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
