import { useAuth } from "@/context/AuthContext";
import { VendorRoom } from "@/types";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { BASE, inputCls, labelCls } from "@/utils";
import toast from "react-hot-toast";
import FieldError from "@/components/common/FieldError";
import {
  Hash,
  ImageIcon,
  Layers,
  Loader2,
  Maximize2,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";

const MAX_ROOM_IMAGES = 10;

type ExistingUnit = {
  id: string;
  unitName: string;
  floorNumber: string;
  initialUnitName: string;
  initialFloorNumber: string;
  deleted: boolean;
};

type NewUnit = {
  unitName: string;
  floorNumber: string;
};

const updateRoomSchema = yup.object({
  name: yup.string().required("Room name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Must be a number")
    .required("Price is required")
    .min(1, "Must be positive"),
  capacity: yup
    .number()
    .typeError("Must be a number")
    .required("Capacity is required")
    .min(1)
    .max(20),
  view: yup.string().required("View type is required"),
  size: yup.string().required("Size is required"),
  amenities: yup.string().required("Amenities are required"),
  badge: yup.string(),
  isActive: yup.boolean(),
});

type UpdateRoomFormValues = {
  name: string;
  description: string;
  price: number;
  capacity: number;
  view: string;
  size: string;
  amenities: string;
  badge?: string;
  isActive?: boolean;
};

export default function EditRoomForm({
  room,
  hotelName,
  onUpdated,
}: {
  room: VendorRoom;
  hotelName: string;
  onUpdated: () => void;
}) {
  const { token } = useAuth();

  // File objects to send (new + existing-fetched-as-blobs)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Existing server image URLs still retained (URL-only mode)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  // What's shown: existing URLs first, then object URLs for new files
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [fetchingImages, setFetchingImages] = useState(false);
  // True when user removed an existing URL without adding new files
  const [existingModified, setExistingModified] = useState(false);

  // Units state
  const [existingUnits, setExistingUnits] = useState<ExistingUnit[]>([]);
  const [newUnits, setNewUnits] = useState<NewUnit[]>([]);
  const [unitsError, setUnitsError] = useState("");

  // Init existing images from room prop
  useEffect(() => {
    const previews = (room.images ?? []).map((img) =>
      img.startsWith("http") ? img : `${BASE}${img}`,
    );
    setExistingImageUrls(previews);
    setImagePreviews(previews);
    setExistingModified(false);
    setImageFiles([]);
    setExistingUnits(
      (room.units ?? []).map((u) => ({
        id: u.id,
        unitName: u.unitName ?? "",
        floorNumber: u.floorNumber != null ? String(u.floorNumber) : "",
        initialUnitName: u.unitName ?? "",
        initialFloorNumber: u.floorNumber != null ? String(u.floorNumber) : "",
        deleted: false,
      })),
    );
    setNewUnits([]);
    setUnitsError("");
  }, [room.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateExistingUnit(
    index: number,
    field: "unitName" | "floorNumber",
    value: string,
  ) {
    setExistingUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [field]: value } : u)),
    );
    setUnitsError("");
  }

  function toggleDeleteExistingUnit(index: number) {
    setExistingUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, deleted: !u.deleted } : u)),
    );
    setUnitsError("");
  }

  function addNewUnitRow() {
    setNewUnits((prev) => [...prev, { unitName: "", floorNumber: "" }]);
    setUnitsError("");
  }

  function removeNewUnitRow(index: number) {
    setNewUnits((prev) => prev.filter((_, i) => i !== index));
  }

  function updateNewUnit(
    index: number,
    field: "unitName" | "floorNumber",
    value: string,
  ) {
    setNewUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [field]: value } : u)),
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRoomFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(updateRoomSchema) as any,
    mode: "onTouched",
    defaultValues: {
      name: room.name,
      description: room.description ?? "",
      price: room.price,
      capacity: room.capacity,
      view: room.view,
      size: room.size,
      amenities: (room.amenities ?? []).join(", "),
      badge: room.badge ?? "",
      isActive: room.isActive,
    },
  });

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    if (!newFiles.length) return;
    e.target.value = "";

    if (imagePreviews.length + newFiles.length > MAX_ROOM_IMAGES) {
      setImageError(`You can upload at most ${MAX_ROOM_IMAGES} images.`);
      return;
    }

    // If existing server images haven't been converted to Files yet, fetch them
    // so imageFiles contains ALL images (existing + new) for the submit payload.
    let existingAsFiles: File[] = [];
    if (existingImageUrls.length > 0) {
      setFetchingImages(true);
      try {
        existingAsFiles = await Promise.all(
          existingImageUrls.map(async (url, i) => {
            const res = await fetch(url, { credentials: "include" });
            const blob = await res.blob();
            const name = url.split("/").pop() || `existing-${i}.webp`;
            return new File([blob], name, { type: blob.type });
          }),
        );
      } catch {
        setFetchingImages(false);
        toast.error(
          "Could not load existing images. Please re-upload all images manually.",
        );
        return;
      }
      setFetchingImages(false);
      setExistingImageUrls([]);
    }

    const allFiles = [...existingAsFiles, ...imageFiles, ...newFiles];
    setImageFiles(allFiles);
    setImagePreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ]);
    setImageError("");
  }

  function removePreview(index: number) {
    if (existingImageUrls.length > 0 && index < existingImageUrls.length) {
      // URL-only mode — remove from URL list
      setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
      setExistingModified(true);
    } else {
      // After conversion (or for new files)
      const fileIndex =
        existingImageUrls.length > 0 ? index - existingImageUrls.length : index;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(data: UpdateRoomFormValues) {
    // Validate at least one unit will remain
    const remainingExisting = existingUnits.filter((u) => !u.deleted).length;
    const totalAfter = remainingExisting + newUnits.length;
    if (totalAfter < 1) {
      setUnitsError("At least one unit is required");
      return;
    }

    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("description", data.description);
    fd.append("price", String(data.price));
    fd.append("capacity", String(data.capacity));
    fd.append("view", data.view);
    fd.append("size", data.size);
    data.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .forEach((a) => fd.append("amenities", a));
    if (data.badge) fd.append("badge", data.badge);
    fd.append("isActive", data.isActive ? "true" : "false");

    // Build newUnits JSON for the room PATCH (server creates them in tx)
    const newUnitSpecs = newUnits.map((u) => ({
      ...(u.unitName.trim() ? { unitName: u.unitName.trim() } : {}),
      ...(u.floorNumber.trim()
        ? { floorNumber: parseInt(u.floorNumber, 10) }
        : {}),
    }));
    if (newUnitSpecs.length > 0) {
      fd.append("newUnits", JSON.stringify(newUnitSpecs));
    }

    let filesToSend = [...imageFiles];

    // User removed some existing images but didn't add new files — fetch remaining URLs as blobs
    if (existingModified && imageFiles.length === 0) {
      setFetchingImages(true);
      try {
        filesToSend = await Promise.all(
          existingImageUrls.map(async (url, i) => {
            const res = await fetch(url, { credentials: "include" });
            const blob = await res.blob();
            const name = url.split("/").pop() || `existing-${i}.webp`;
            return new File([blob], name, { type: blob.type });
          }),
        );
      } catch {
        setFetchingImages(false);
        toast.error("Could not process images. Please try again.");
        return;
      }
      setFetchingImages(false);
    }

    if (filesToSend.length > 0) {
      filesToSend.forEach((file) => fd.append("images", file));
    }

    try {
      // 1) Apply per-unit updates and deletions in parallel
      const unitOps: Promise<Response>[] = [];
      for (const u of existingUnits) {
        if (u.deleted) {
          unitOps.push(
            fetch(`${BASE}/rooms/units/${u.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }),
          );
          continue;
        }
        const nameChanged = u.unitName.trim() !== u.initialUnitName.trim();
        const floorChanged =
          u.floorNumber.trim() !== u.initialFloorNumber.trim();
        if (nameChanged || floorChanged) {
          const body: Record<string, unknown> = {};
          if (nameChanged) body.unitName = u.unitName.trim();
          if (floorChanged) {
            body.floorNumber = u.floorNumber.trim()
              ? parseInt(u.floorNumber, 10)
              : null;
          }
          unitOps.push(
            fetch(`${BASE}/rooms/units/${u.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(body),
            }),
          );
        }
      }

      if (unitOps.length > 0) {
        const results = await Promise.all(unitOps);
        const failed = results.find((r) => !r.ok);
        if (failed) {
          const json = await failed.json().catch(() => ({}));
          throw new Error(json.message || "Failed to update one or more units");
        }
      }

      // 2) Update the room itself (and create new units in the same tx)
      const res = await fetch(`${BASE}/rooms/${room.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update room");
      onUpdated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const busy = isSubmitting || fetchingImages;

  return (
    <form
      onSubmit={handleSubmit(onSubmit as never)}
      noValidate
      className="space-y-5"
    >
      {/* Hotel info (read-only) */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <Hash className="h-4 w-4 shrink-0 text-gray-400" />
        <div className="min-w-0">
          <p className="text-xs text-gray-400">Editing room in hotel</p>
          <p className="mt-0.5 truncate text-xs font-medium text-gray-700 dark:text-gray-300">
            {hotelName}
          </p>
        </div>
      </div>

      {/* Name + Badge */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Room Name</label>
          <input
            type="text"
            {...register("name")}
            className={inputCls(!!errors.name)}
          />
          <FieldError msg={errors.name?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            Badge <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            {...register("badge")}
            placeholder="Best Value, Most Popular…"
            className={inputCls()}
          />
        </div>
      </div>

      {/* Price + Capacity */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              Price per Night (৳)
            </span>
          </label>
          <input
            type="number"
            {...register("price")}
            min={1}
            className={inputCls(!!errors.price)}
          />
          <FieldError msg={errors.price?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Guest Capacity
            </span>
          </label>
          <input
            type="number"
            {...register("capacity")}
            min={1}
            max={20}
            className={inputCls(!!errors.capacity)}
          />
          <FieldError msg={errors.capacity?.message} />
        </div>
      </div>

      {/* View + Size */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>View Type</label>
          <input
            type="text"
            {...register("view")}
            className={inputCls(!!errors.view)}
          />
          <FieldError msg={errors.view?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" /> Room Size
            </span>
          </label>
          <input
            type="text"
            {...register("size")}
            className={inputCls(!!errors.size)}
          />
          <FieldError msg={errors.size?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls()}>Description</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Describe the room features, furnishings, and highlights…"
          className={inputCls(!!errors.description)}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      {/* Amenities */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Amenities{" "}
            <span className="font-normal text-gray-400">(comma-separated)</span>
          </span>
        </label>
        <input
          type="text"
          {...register("amenities")}
          placeholder="AC, WiFi, Minibar, Smart TV"
          className={inputCls(!!errors.amenities)}
        />
        <FieldError msg={errors.amenities?.message} />
      </div>

      {/* Room Units */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Room Units{" "}
            <span className="font-normal text-gray-400">
              (at least 1 required)
            </span>
          </span>
        </label>
        <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
          Each unit is a physical room of this type. Edit, remove or add units
          below.
        </p>

        <div className="space-y-3">
          {existingUnits.map((unit, index) => (
            <div
              key={unit.id}
              className={`flex items-start gap-3 rounded-xl border bg-gray-50 p-3 transition-colors dark:bg-gray-800/50 ${
                unit.deleted
                  ? "border-red-200 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  unit.deleted
                    ? "bg-red-100 text-red-700 line-through dark:bg-red-900/40 dark:text-red-400"
                    : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                }`}
              >
                {index + 1}
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    value={unit.unitName}
                    onChange={(e) =>
                      updateExistingUnit(index, "unitName", e.target.value)
                    }
                    placeholder="Unit name (e.g. Room 101)"
                    className={inputCls()}
                    disabled={unit.deleted}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={unit.floorNumber}
                    onChange={(e) =>
                      updateExistingUnit(index, "floorNumber", e.target.value)
                    }
                    placeholder="Floor number (optional)"
                    min={0}
                    className={inputCls()}
                    disabled={unit.deleted}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleDeleteExistingUnit(index)}
                className={`mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  unit.deleted
                    ? "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
                    : "text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                }`}
                title={unit.deleted ? "Undo remove" : "Remove unit"}
              >
                {unit.deleted ? (
                  <Undo2 className="h-3.5 w-3.5" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          ))}

          {newUnits.map((unit, index) => (
            <div
              key={`new-${index}`}
              className="flex items-start gap-3 rounded-xl border border-dashed border-green-300 bg-green-50/40 p-3 dark:border-green-800 dark:bg-green-950/20"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-600 text-xs font-bold text-white">
                +
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    value={unit.unitName}
                    onChange={(e) =>
                      updateNewUnit(index, "unitName", e.target.value)
                    }
                    placeholder="Unit name (e.g. Room 305)"
                    className={inputCls()}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={unit.floorNumber}
                    onChange={(e) =>
                      updateNewUnit(index, "floorNumber", e.target.value)
                    }
                    placeholder="Floor number (optional)"
                    min={0}
                    className={inputCls()}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeNewUnitRow(index)}
                className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                title="Discard new unit"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addNewUnitRow}
          className="mt-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Another Unit
        </button>
        <FieldError msg={unitsError} />
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Active
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Only active rooms are shown to guests
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            {...register("isActive")}
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full dark:bg-gray-600" />
        </label>
      </div>

      {/* Room images */}
      <div>
        <div className="mb-2 flex items-start justify-between">
          <div>
            <label className={labelCls()}>
              <span className="flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" /> Room Photos
              </span>
            </label>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              You can add or remove images individually. Upload 1–
              {MAX_ROOM_IMAGES} photos.
            </p>
          </div>
          {imagePreviews.length > 0 &&
            imagePreviews.length < MAX_ROOM_IMAGES && (
              <label
                className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 ${fetchingImages ? "pointer-events-none opacity-60" : ""}`}
              >
                {fetchingImages ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                  </>
                ) : (
                  "+ Add more"
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={fetchingImages}
                  onChange={handleImageChange}
                />
              </label>
            )}
        </div>

        {imagePreviews.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
              >
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="160px"
                />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {imagePreviews.length < MAX_ROOM_IMAGES && (
              <label
                className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800/50 ${fetchingImages ? "cursor-wait opacity-60" : "hover:border-green-400 hover:bg-green-50/30 dark:hover:border-green-600"}`}
              >
                {fetchingImages ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-gray-300" />
                )}
                <span className="text-xs text-gray-400">
                  {fetchingImages ? "Loading…" : "Add"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={fetchingImages}
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        ) : (
          <label
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors hover:border-green-400 hover:bg-green-50/30 dark:hover:border-green-600 ${imageError ? "border-red-400 bg-red-50/20 dark:border-red-700" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Click to upload photos
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                Select up to {MAX_ROOM_IMAGES} images — JPEG, PNG or WebP
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}

        {imageError && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {imageError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
        {isSubmitting
          ? "Saving…"
          : fetchingImages
            ? "Processing images…"
            : "Save Changes"}
      </button>
    </form>
  );
}
