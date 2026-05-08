"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import type {
  UserProfile,
  Booking,
  BookingStatus,
  VendorDestination,
} from "@/types";
import { useAuth } from "@/context/AuthContext";
import { BASE } from "@/utils";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe,
  Plus,
  RefreshCw,
} from "lucide-react";
import DestinationCard from "./DestinationCard";
import FormModal from "./FormModal";
import CreateDestinationForm from "./CreateDestinationForm";

export default function VendorDestinationsList() {
  const { token } = useAuth();
  const [destinations, setDestinations] = useState<VendorDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadDestinations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/destinations/mine?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setDestinations(json.data ?? []);
    } catch {
      toast.error("Failed to load your destinations.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const totalApproved = destinations.filter(
    (d) => d.approvalStatus === "APPROVED",
  ).length;
  const totalPending = destinations.filter(
    (d) => d.approvalStatus === "PENDING",
  ).length;
  const totalHotels = destinations.reduce((s, d) => s + d._count.hotels, 0);

  return (
    <>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Destinations",
              value: destinations.length,
              icon: (
                <Globe className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              ),
              bg: "bg-violet-50 dark:bg-violet-950/30",
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
              label: "Properties Listed",
              value: totalHotels,
              icon: (
                <Building2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
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
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              My Destinations
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {loading
                ? "Loading…"
                : `${destinations.length} destination${destinations.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadDestinations}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 active:bg-violet-800"
            >
              <Plus className="h-4 w-4" />
              New Destination
            </button>
          </div>
        </div>

        {/* Pending notice */}
        {totalPending > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-950/20">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {totalPending} destination{totalPending !== 1 ? "s are" : " is"}{" "}
              awaiting review. Once approved, they&apos;ll appear in your property
              creation form.
            </p>
          </div>
        )}

        {/* Info note */}
        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/30 dark:bg-blue-950/20">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Approved destinations will appear in the property creation form when
            you add a new property.
          </p>
        </div>

        {/* Destination list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          </div>
        ) : destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/30">
              <Globe className="h-8 w-8 text-violet-400" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              No destinations yet
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              Add a destination to group your hotels by location
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-5 flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              <Plus className="h-4 w-4" />
              Create Destination
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <FormModal
          title="Create New Destination"
          onClose={() => setShowCreateModal(false)}
        >
          <CreateDestinationForm
            onCreated={() => {
              setShowCreateModal(false);
              loadDestinations();
              toast.success("Destination submitted for approval!");
            }}
          />
        </FormModal>
      )}
    </>
  );
}
