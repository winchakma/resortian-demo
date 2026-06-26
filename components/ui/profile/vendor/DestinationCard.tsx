import { VendorDestination } from "@/types";
import Image from "next/image";
import { Globe, MapPin, Building2, FileText, AlertCircle } from "lucide-react";
import ApprovalBadge from "./ApprovalBadge";
import { BASE, fmtDate } from "@/utils";

export default function DestinationCard({
  destination,
}: {
  destination: VendorDestination;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="flex gap-4 p-5">
        {/* Image */}
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          {destination.image ? (
            <Image
              src={`${BASE}${destination.image}`}
              alt={destination.name}
              fill
              unoptimized
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Globe className="h-8 w-8 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-black dark:text-white">
                {destination.name}
              </h4>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-black dark:text-gray-500">
                <MapPin className="h-3 w-3 shrink-0" />
                {destination.region}
              </div>
            </div>
            <ApprovalBadge status={destination.approvalStatus} />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {destination._count.hotels} hotel
              {destination._count.hotels !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              Added {fmtDate(destination.createdAt)}
            </span>
          </div>

          {destination.approvalStatus === "REJECTED" &&
            destination.rejectionReason && (
              <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 dark:border-red-900/30 dark:bg-red-950/20">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                <p className="text-xs text-red-600 dark:text-red-400">
                  {destination.rejectionReason}
                </p>
              </div>
            )}

          {destination.description && (
            <p className="mt-2 line-clamp-2 text-xs text-black dark:text-gray-500">
              {destination.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
