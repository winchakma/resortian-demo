"use client";

import { useAuth } from "@/context/AuthContext";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { BASE, inputCls, labelCls } from "@/utils";
import toast from "react-hot-toast";
import {
  Hash,
  Users,
  Maximize2,
  Sparkles,
  Upload,
  Plus,
  ImageIcon,
  BedDouble,
} from "lucide-react";
import FieldError from "@/components/common/FieldError";
import Image from "next/image";

type RoomFormValues = {
  hotelId: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  view: string;
  size: string;
  amenities: string;
  badge?: string;
};

const roomSchema = yup.object({
  hotelId: yup.string().required("Hotel ID is required"),
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
});

export default function CreateRoomForm({
  hotelId,
  hotelName,
  onCreated,
}: {
  hotelId: string;
  hotelName: string;
  onCreated: () => void;
}) {
  const { token } = useAuth();
  const imagesRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagesError, setImagesError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(roomSchema) as any,
    mode: "onTouched",
    defaultValues: { hotelId },
  });

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setImagesError("");
    const arr = Array.from(files);
    setSelectedFiles(arr);
    setImagePreviews(arr.map((f) => URL.createObjectURL(f)));
  }

  async function onSubmit(data: RoomFormValues) {
    if (selectedFiles.length === 0) {
      setImagesError("Please select at least one image");
      return;
    }

    const fd = new FormData();
    fd.append("hotelId", hotelId);
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
    selectedFiles.forEach((f) => fd.append("images", f));

    try {
      const res = await fetch(`${BASE}/rooms`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add room");
      reset({ hotelId });
      if (imagesRef.current) imagesRef.current.value = "";
      setImagePreviews([]);
      setSelectedFiles([]);
      onCreated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit as never)}
      noValidate
      className="space-y-5"
    >
      {/* Hotel ID (read-only info) */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <Hash className="h-4 w-4 shrink-0 text-gray-400" />
        <div className="min-w-0">
          <p className="text-xs text-gray-400">Adding room to hotel</p>
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
            placeholder="Deluxe Sea View"
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
            placeholder="5000"
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
            placeholder="2"
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
            placeholder="Sea View, Garden View…"
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
            placeholder="38 m²"
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
          placeholder="AC, WiFi, Minibar, Smart TV, Bathtub"
          className={inputCls(!!errors.amenities)}
        />
        <FieldError msg={errors.amenities?.message} />
      </div>

      {/* Room images */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Room Photos{" "}
            <span className="font-normal text-gray-400">(up to 10)</span>
          </span>
        </label>
        <div
          className={`relative rounded-xl border-2 border-dashed transition-colors ${imagesError ? "border-red-400 bg-red-50 dark:bg-red-950/20" : "border-gray-200 bg-gray-50 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-800/50"}`}
        >
          {imagePreviews.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-5">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={src}
                    alt={`Photo ${i + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-colors hover:border-violet-400 dark:border-gray-600">
                <Plus className="h-5 w-5 text-gray-300" />
                <input
                  ref={imagesRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <ImageIcon className="mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Click to upload room photos
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG or WebP — max 10 MB each
              </p>
            </div>
          )}
          {imagePreviews.length === 0 && (
            <input
              ref={imagesRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          )}
        </div>
        <FieldError msg={imagesError} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <BedDouble className="h-4 w-4" />
        {isSubmitting ? "Submitting…" : "Submit Room for Approval"}
      </button>
    </form>
  );
}
