import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { ProfileGuard } from "@/components/ui/ProfileGuard";
import { ProfileLoader } from "@/components/ui/ProfileLoader";

export const metadata: Metadata = {
  title: "My Profile | Resortian",
  description: "Manage your profile, view bookings, and update settings.",
};

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        <ProfileGuard>
          <ProfileLoader />
        </ProfileGuard>
      </main>
      <Footer />
    </>
  );
}
