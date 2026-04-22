import { VendorHotel, VendorRoom } from "@/types";
import RoomRow from "./RoomRow";
import Image from "next/image";
import {
  BedDouble,
  Pencil,
  Trash2,
  AlertCircle,
  Star,
  MapPin,
  ImageIcon,
  ChevronDown,
  Plus,
} from "lucide-react";
import ApprovalBadge from "./ApprovalBadge";
import { BASE } from "@/utils";

export default function HotelCard({
  hotel,
  expanded,
  onToggle,
  onAddRoom,
  onEdit,
  onDelete,
  onEditRoom,
  onDeleteRoom,
}: {
  hotel: VendorHotel;
  expanded: boolean;
  onToggle: () => void;
  onAddRoom: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditRoom: (room: VendorRoom) => void;
  onDeleteRoom: (room: VendorRoom) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      {/* Hotel header */}
      <div className="flex gap-4 p-5">
        {/* Image */}
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          {hotel.image ? (
            <Image
              src={`${BASE}${hotel.image}`}
              alt={hotel.name}
              fill
              unoptimized
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {hotel.name}
              </h4>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <MapPin className="h-3 w-3 shrink-0" />
                {hotel.location}
                {hotel.destination && (
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                )}
                {hotel.destination?.name}
              </div>
            </div>
            <ApprovalBadge status={hotel.approvalStatus} />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              ৳{hotel.price.toLocaleString()}/night
            </span>
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {hotel._count.rooms} room{hotel._count.rooms !== 1 ? "s" : ""}
            </span>
            {hotel.approvalStatus === "APPROVED" && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {hotel.rating > 0 ? hotel.rating.toFixed(1) : "No reviews"}
              </span>
            )}
          </div>

          {hotel.approvalStatus === "REJECTED" && hotel.rejectionReason && (
            <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 dark:border-red-900/30 dark:bg-red-950/20">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
              <p className="text-xs text-red-600 dark:text-red-400">
                {hotel.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-800">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
          {expanded ? "Hide" : "Show"} Rooms
          <span className="ml-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {hotel._count.rooms}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
          <button
            type="button"
            onClick={onAddRoom}
            className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-400 dark:hover:bg-violet-950/50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Room
          </button>
        </div>
      </div>

      {/* Rooms list */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {hotel.rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BedDouble className="mb-2 h-8 w-8 text-gray-200 dark:text-gray-700" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No rooms added yet
              </p>
              <button
                type="button"
                onClick={onAddRoom}
                className="mt-3 text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
              >
                + Add your first room
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {hotel.rooms.map((room) => (
                <RoomRow
                  key={room.id}
                  room={room}
                  onEdit={() => onEditRoom(room)}
                  onDelete={() => onDeleteRoom(room)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
