"use client";

import { VendorRoom } from "@/types";
import { BASE } from "@/utils";
import Image from "next/image";
import {
  X,
  BedDouble,
  Users,
  Eye,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Tag,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ApprovalBadge from "./ApprovalBadge";
import { useState } from "react";

export default function RoomDetailModal({
  room,
  onClose,
}: {
  room: VendorRoom;
  onClose: () => void;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = room.images ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image carousel */}
        <div className="relative h-52 w-full bg-gray-100 dark:bg-gray-800">
          {images.length > 0 ? (
            <>
              <Image
                src={`${BASE}${images[imgIndex]}`}
                alt={room.name}
                fill
                unoptimized
                className="object-cover"
                sizes="512px"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + images.length) % images.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white backdrop-blur-sm hover:bg-black/60"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % images.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white backdrop-blur-sm hover:bg-black/60"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-300" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white">{room.name}</h2>
              {room.badge && (
                <span className="mt-1 inline-block rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {room.badge}
                </span>
              )}
            </div>
            <ApprovalBadge status={room.approvalStatus} sm />
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800">
              <p className="text-lg font-bold text-black dark:text-white">
                ৳{room.price.toLocaleString()}
              </p>
              <p className="text-xs text-black">per night</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800">
              <p className="flex items-center justify-center gap-1 text-lg font-bold text-black dark:text-white">
                <Users className="h-4 w-4" />{room.capacity}
              </p>
              <p className="text-xs text-black">guest{room.capacity !== 1 ? "s" : ""}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800">
              <p className="flex items-center justify-center gap-1 text-sm font-bold text-black dark:text-white">
                <Eye className="h-4 w-4" />{room.view || "—"}
              </p>
              <p className="text-xs text-black">view</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800">
              <p className="flex items-center justify-center gap-1 text-sm font-bold text-black dark:text-white">
                <Maximize2 className="h-4 w-4" />{room.size || "—"}
              </p>
              <p className="text-xs text-black">size</p>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-black">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-black dark:text-gray-300">
                {room.description}
              </p>
            </div>
          )}

          {/* Units */}
          {room.units && room.units.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-black">
                Units ({room.units.length})
              </h3>
              <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-700">
                {room.units.map((u, i) => (
                  <div key={u.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="font-medium text-black dark:text-white">
                      {u.unitName || `Unit ${i + 1}`}
                    </span>
                    {u.floorNumber != null && (
                      <span className="text-xs text-black">Floor {u.floorNumber}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {room.amenities.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-black">
                <BedDouble className="h-3.5 w-3.5" /> Amenities
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {room.amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1.5 text-xs text-black dark:text-gray-300"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex flex-wrap gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-black dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <span>
              Status:{" "}
              <span className="font-semibold capitalize">
                {room.approvalStatus.toLowerCase()}
              </span>
            </span>
            <span>
              Active: <span className="font-semibold">{room.isActive ? "Yes" : "No"}</span>
            </span>
            {room.badge && (
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span className="font-semibold">{room.badge}</span>
              </span>
            )}
          </div>

          {/* Rejection reason */}
          {room.approvalStatus === "REJECTED" && room.rejectionReason && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900/30 dark:bg-red-950/20">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                  Rejection Reason
                </p>
                <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">
                  {room.rejectionReason}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
