"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  BedDouble,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
  AlertCircle,
} from "lucide-react";
import { BASE } from "@/utils";
import type { VendorHotel, VendorRoom } from "@/types";
import HotelCard from "./HotelCard";
import FormModal from "./FormModal";
import CreateHotelForm from "./CreateHotelForm";
import CreateRoomForm from "./CreateRoomForm";
import EditHotelForm from "./EditHotelForm";
import EditRoomForm from "./EditRoomForm";
import ConfirmModal from "@/components/common/ConfirmModal";

type VendorModal =
  | "create-hotel"
  | { type: "add-room"; hotelId: string; hotelName: string }
  | { type: "edit-hotel"; hotel: VendorHotel }
  | { type: "edit-room"; room: VendorRoom; hotelName: string }
  | null;

type ConfirmState =
  | { type: "delete-hotel"; id: string; name: string }
  | { type: "delete-room"; id: string; name: string }
  | null;

export default function VendorHotelsList() {
  const { token } = useAuth();
  const [hotels, setHotels] = useState<VendorHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<VendorModal>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  async function handleDeleteHotel(id: string) {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE}/hotels/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to delete hotel");
      }
      toast.success("Property deleted successfully.");
      setConfirm(null);
      loadHotels();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleDeleteRoom(id: string) {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE}/rooms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to delete room");
      }
      toast.success("Room deleted successfully.");
      setConfirm(null);
      loadHotels();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  }

  const loadHotels = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/hotels/mine?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setHotels(json.data ?? []);
    } catch {
      toast.error("Failed to load your hotels.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  const totalApproved = hotels.filter(
    (h) => h.approvalStatus === "APPROVED",
  ).length;
  const totalPending = hotels.filter(
    (h) => h.approvalStatus === "PENDING",
  ).length;
  const totalRooms = hotels.reduce((s, h) => s + h._count.rooms, 0);

  return (
    <>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Properties",
              value: hotels.length,
              icon: (
                <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              ),
              bg: "bg-green-50 dark:bg-green-950/30",
            },
            {
              label: "Approved",
              value: totalApproved,
              icon: (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ),
              bg: "bg-emerald-50 dark:bg-emerald-950/30",
            },
            {
              label: "Under Review",
              value: totalPending,
              icon: (
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              ),
              bg: "bg-amber-50 dark:bg-amber-950/30",
            },
            {
              label: "Total Rooms",
              value: totalRooms,
              icon: (
                <BedDouble className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              ),
              bg: "bg-primary-50 dark:bg-primary-950/30",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-black dark:text-white">
                  {s.value}
                </p>
                <p className="text-xs text-black dark:text-gray-400">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black dark:text-white">
              My Properties
            </h3>
            <p className="text-xs text-black dark:text-gray-500">
              {loading
                ? "Loading…"
                : `${hotels.length} propert${hotels.length !== 1 ? "ies" : "y"} in your portfolio`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadHotels}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-black transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            {hotels.length === 0 && (
              <button
                type="button"
                onClick={() => setModal("create-hotel")}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 active:bg-green-800"
              >
                <Plus className="h-4 w-4" />
                New Property
              </button>
            )}
          </div>
        </div>

        {/* Approval notice */}
        {totalPending > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-950/20">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {totalPending} propert{totalPending !== 1 ? "ies are" : "y is"}{" "}
              under review. Properties and rooms go live once approved by our
              team.
            </p>
          </div>
        )}

        {/* Hotel list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
          </div>
        ) : hotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-950/30">
              <Building2 className="h-8 w-8 text-green-400" />
            </div>
            <p className="font-semibold text-black dark:text-gray-300">
              No properties yet
            </p>
            <p className="mt-1 text-sm text-black dark:text-gray-500">
              Create your first property to get started
            </p>
            <button
              type="button"
              onClick={() => setModal("create-hotel")}
              className="mt-5 flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Create Property
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                expanded={!collapsedIds.has(hotel.id)}
                onToggle={() =>
                  setCollapsedIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(hotel.id)) next.delete(hotel.id);
                    else next.add(hotel.id);
                    return next;
                  })
                }
                onAddRoom={() =>
                  setModal({
                    type: "add-room",
                    hotelId: hotel.id,
                    hotelName: hotel.name,
                  })
                }
                onEdit={() => setModal({ type: "edit-hotel", hotel })}
                onDelete={() =>
                  setConfirm({
                    type: "delete-hotel",
                    id: hotel.id,
                    name: hotel.name,
                  })
                }
                onEditRoom={(room) => {
                  setModal({ type: "edit-room", room, hotelName: hotel.name });
                }}
                onDeleteRoom={(room) =>
                  setConfirm({
                    type: "delete-room",
                    id: room.id,
                    name: room.name,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === "create-hotel" && (
        <FormModal title="Create New Property" onClose={() => setModal(null)}>
          <CreateHotelForm
            onCreated={(hotelId, hotelName) => {
              setModal(null);
              loadHotels();
              toast.success("Property submitted for approval!");
              setTimeout(
                () => setModal({ type: "add-room", hotelId, hotelName }),
                400,
              );
            }}
          />
        </FormModal>
      )}
      {modal && typeof modal === "object" && modal.type === "add-room" && (
        <FormModal
          title={`Add Room Type — ${modal.hotelName}`}
          onClose={() => setModal(null)}
        >
          <CreateRoomForm
            hotelId={modal.hotelId}
            hotelName={modal.hotelName}
            onCreated={() => {
              loadHotels();
              toast.success("Room submitted for approval!");
            }}
          />
        </FormModal>
      )}
      {modal && typeof modal === "object" && modal.type === "edit-hotel" && (
        <FormModal
          title={`Edit Property — ${modal.hotel.name}`}
          onClose={() => setModal(null)}
        >
          <EditHotelForm
            hotel={modal.hotel}
            onUpdated={() => {
              setModal(null);
              loadHotels();
              toast.success("Property updated successfully!");
            }}
          />
        </FormModal>
      )}
      {modal && typeof modal === "object" && modal.type === "edit-room" && (
        <FormModal
          title={`Edit Room — ${modal.room.name}`}
          onClose={() => setModal(null)}
        >
          <EditRoomForm
            room={modal.room}
            hotelName={modal.hotelName}
            onUpdated={() => {
              setModal(null);
              loadHotels();
              toast.success("Room updated successfully!");
            }}
          />
        </FormModal>
      )}
      {confirm && (
        <ConfirmModal
          title={
            confirm.type === "delete-hotel" ? "Delete Hotel" : "Delete Room"
          }
          message={
            confirm.type === "delete-hotel"
              ? `Are you sure you want to delete "${confirm.name}"? This will permanently remove all its rooms and data.`
              : `Are you sure you want to delete room "${confirm.name}"? This cannot be undone.`
          }
          loading={deleteLoading}
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm.type === "delete-hotel") handleDeleteHotel(confirm.id);
            else handleDeleteRoom(confirm.id);
          }}
        />
      )}
    </>
  );
}
