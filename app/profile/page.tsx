import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { ProfileContent } from "@/components/ui/ProfileContent";
import { getUserProfile, getUserBookings } from "@/utils/api";

export const metadata: Metadata = {
  title: "My Profile | Resortian",
  description: "Manage your profile, view bookings, and update settings.",
};

export default async function ProfilePage() {
  const [user, bookings] = await Promise.all([
    getUserProfile(),
    getUserBookings(),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <ProfileContent user={user} bookings={bookings} />
      </main>
      <Footer />
    </>
  );
}
