import { VendorRoom } from "@/types";
import Image from "next/image";
import { BedDouble, Pencil, Trash2, AlertCircle } from "lucide-react";
import ApprovalBadge from "./ApprovalBadge";
import { BASE } from "@/utils";

export default function RoomRow({
  room,
  onEdit,
  onDelete,
}: {
  room: VendorRoom;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      {/* Thumbnail */}
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {room.images?.[0] ? (
          <Image
            src={`${BASE}${room.images[0]}`}
            alt={room.name}
            fill
            unoptimized
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BedDouble className="h-5 w-5 text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {room.name}
            </p>
            {room.badge && (
              <span className="rounded-md bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-950/30 dark:text-primary-400">
                {room.badge}
              </span>
            )}
          </div>
          <ApprovalBadge status={room.approvalStatus} sm />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400 dark:text-gray-500">
          <span>৳{room.price.toLocaleString()}/night</span>
          <span>
            {room.capacity} guest{room.capacity !== 1 ? "s" : ""}
          </span>
          <span>{room.view}</span>
          <span>{room.size}</span>
        </div>

        {room.approvalStatus === "REJECTED" && room.rejectionReason && (
          <div className="mt-1.5 flex items-start gap-1.5">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
            <p className="text-[11px] text-red-500 dark:text-red-400">
              {room.rejectionReason}
            </p>
          </div>
        )}

        {/* Room actions */}
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
