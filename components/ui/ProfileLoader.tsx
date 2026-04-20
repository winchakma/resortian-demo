"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProfileContent } from "@/components/ui/ProfileContent";
import type { UserProfile, Booking } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

async function fetchWithToken<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json() as Promise<T>;
}

function mapStatus(s: string): "upcoming" | "completed" | "cancelled" {
  if (s === "CONFIRMED" || s === "PENDING") return "upcoming";
  if (s === "COMPLETED") return "completed";
  return "cancelled";
}

export function ProfileLoader() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!token || !user) return;

    async function load() {
      try {
        const meData = await fetchWithToken<{
          id: string;
          name: string;
          phone: string;
          email: string | null;
          address: string | null;
          avatar: string | null;
          memberSince: string;
          role: "USER" | "ADMIN" | "HOTEL_OWNER" | "SUPER_ADMIN";
        }>("/users/me", token!);

        setProfile({
          id: meData.id,
          name: meData.name,
          phone: meData.phone,
          email: meData.email ?? "",
          address: meData.address ?? "",
          memberSince: meData.memberSince,
          avatar: meData.avatar ?? undefined,
          role: meData.role,
        });

        // Hotel owners don't have guest bookings
        if (meData.role === "HOTEL_OWNER") return;

        const bookingsData = await fetchWithToken<{
          data: Array<{
            id: string;
            reference: string;
            hotelId: string;
            checkIn: string;
            checkOut: string;
            nights: number;
            guests: number;
            totalPrice: number;
            advancePaid: number;
            balanceDue: number;
            status: string;
            paymentMethod: string;
            bookedOn: string;
            room: {
              id: string;
              name: string;
              images: string[];
              price: number;
              hotel: {
                id: string;
                name: string;
                slug: string;
                location: string;
                image: string;
              };
            };
          }>;
        }>("/users/me/bookings", token!);

        setBookings(
          bookingsData?.data?.map((b) => ({
            id: b.id,
            reference: b.reference,
            hotelName: b.room.hotel.name,
            hotelSlug: b.room.hotel.slug,
            hotelImage:
              b.room.images?.length > 0 ? `${BASE}${b.room.images[0]}` : "",
            hotelLocation: b.room.hotel.location,
            roomName: b.room.name,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            nights: b.nights,
            guests: b.guests,
            totalPrice: b.totalPrice,
            advancePaid: b.advancePaid,
            balanceDue: b.balanceDue,
            status: mapStatus(b.status),
            bookedOn: b.bookedOn,
            paymentMethod:
              b.paymentMethod === "STRIPE" ? "stripe" : "uddoktapay",
            currency: "BDT",
          })),
        );
      } catch (error) {
        console.error(error);
        setFetchError(true);
      }
    }

    load();
  }, [token, user]);

  if (fetchError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-500">
          Failed to load profile data. Please try again.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return <ProfileContent user={profile} bookings={bookings} />;
}
