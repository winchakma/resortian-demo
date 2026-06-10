"use client";

import { VendorHotel } from "@/types";
import { BASE } from "@/utils";
import Image from "next/image";
import {
  X,
  MapPin,
  Star,
  BedDouble,
  Clock,
  Tag,
  Wifi,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import ApprovalBadge from "./ApprovalBadge";

export default function HotelDetailModal({
  hotel,
  onClose,
}: {
  hotel: VendorHotel;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image */}
        <div className="relative h-52 w-full bg-gray-100 dark:bg-gray-800">
          {hotel.image ? (
            <Image
              src={`${BASE}${hotel.image}`}
              alt={hotel.name}
              fill
              unoptimized
              className="object-cover"
              sizes="672px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
            <h2 className="text-xl font-bold text-white">{hotel.name}</h2>
            <ApprovalBadge status={hotel.approvalStatus} />
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* Basic info row */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary-600" />
              {hotel.location}
              {hotel.destination && ` · ${hotel.destination.name}, ${hotel.destination.region}`}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400" />
              {hotel.rating > 0 ? `${hotel.rating.toFixed(1)} rating` : "No reviews yet"}
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" />
              {hotel._count.rooms} room{hotel._count.rooms !== 1 ? "s" : ""}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ৳{hotel.price.toLocaleString()}/night
            </span>
          </div>

          {/* Description */}
          {hotel.description && (
            <div>
              <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <FileText className="h-3.5 w-3.5" /> Description
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {hotel.description}
              </p>
            </div>
          )}

          {/* Check-in / Check-out */}
          {(hotel.checkinTime || hotel.checkoutTime) && (
            <div className="flex flex-wrap gap-6">
              {hotel.checkinTime && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Check-in</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                    <Clock className="h-4 w-4 text-primary-600" />
                    {hotel.checkinTime}
                  </p>
                </div>
              )}
              {hotel.checkoutTime && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Check-out</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                    <Clock className="h-4 w-4 text-primary-600" />
                    {hotel.checkoutTime}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {hotel.tags.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Tag className="h-3.5 w-3.5" /> Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {hotel.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {hotel.amenities.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Wifi className="h-3.5 w-3.5" /> Amenities
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
                {hotel.amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Booking conditions */}
          {hotel.bookingConditions && (
            <div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Booking Conditions
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {hotel.bookingConditions}
              </p>
            </div>
          )}

          {/* Status */}
          <div className="flex flex-wrap gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <span>
              Status: <span className="font-semibold capitalize">{hotel.approvalStatus.toLowerCase()}</span>
            </span>
            <span>
              Active: <span className="font-semibold">{hotel.isActive ? "Yes" : "No"}</span>
            </span>
            <span>
              Reviews: <span className="font-semibold">{hotel._count.reviews}</span>
            </span>
          </div>

          {/* Rejection reason */}
          {hotel.approvalStatus === "REJECTED" && hotel.rejectionReason && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900/30 dark:bg-red-950/20">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400">Rejection Reason</p>
                <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{hotel.rejectionReason}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
