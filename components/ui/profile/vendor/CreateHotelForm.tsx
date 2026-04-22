import FieldError from "@/components/common/FieldError";
import { useAuth } from "@/context/AuthContext";
import { HotelFormValues, VendorDestination } from "@/types";
import { BASE, inputCls, labelCls } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AlertCircle,
  MapPin,
  Plus,
  Sparkles,
  Tag,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const hotelSchema = yup.object({
  destinationId: yup.string().required("Destination is required"),
  name: yup.string().required("Hotel name is required"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
  location: yup.string().required("Location is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "At least 20 characters"),
  price: yup
    .number()
    .typeError("Must be a number")
    .required("Price is required")
    .min(1, "Must be positive"),
  tags: yup.string(),
  amenities: yup.string(),
});

export default function CreateHotelForm({
  onCreated,
}: {
  onCreated: (hotelId: string, hotelName: string) => void;
}) {
  const { token } = useAuth();
  const [destinations, setDestinations] = useState<
    { id: string; name: string }[]
  >([]);
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HotelFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(hotelSchema) as any,
    mode: "onTouched",
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug, { shouldValidate: false });
    }
  }, [nameValue, setValue]);

  // Load only the vendor's own approved destinations
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/destinations/mine?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const approved = (d.data ?? []).filter(
          (dest: VendorDestination) => dest.approvalStatus === "APPROVED",
        );
        setDestinations(approved);
      })
      .catch(() => {});
  }, [token]);

  async function onSubmit(data: HotelFormValues) {
    const file = imageRef.current?.files?.[0];
    if (!file) {
      setImageError("Please select a hotel cover image");
      return;
    }

    const fd = new FormData();
    fd.append("destinationId", data.destinationId);
    fd.append("name", data.name);
    fd.append("slug", data.slug);
    fd.append("location", data.location);
    fd.append("description", data.description);
    fd.append("price", String(data.price));
    data.tags
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => fd.append("tags", t));
    data.amenities
      ?.split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .forEach((a) => fd.append("amenities", a));
    fd.append("image", file);

    try {
      const res = await fetch(`${BASE}/hotels`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create hotel");
      reset();
      if (imageRef.current) imageRef.current.value = "";
      setImagePreview(null);
      onCreated(json.id, data.name);
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
      {/* Destination */}
      <div>
        <label className={labelCls()}>Destination</label>
        {destinations.length === 0 ? (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-950/20">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              No approved destinations yet. Go to the Destinations tab to create
              one first.
            </p>
          </div>
        ) : (
          <>
            <select
              {...register("destinationId")}
              className={inputCls(!!errors.destinationId)}
            >
              <option value="">Select a destination…</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <FieldError msg={errors.destinationId?.message} />
          </>
        )}
      </div>

      {/* Name + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Hotel Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Sea Pearl Beach Resort"
            className={inputCls(!!errors.name)}
          />
          <FieldError msg={errors.name?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            URL Slug{" "}
            <span className="font-normal text-gray-400">(auto-generated)</span>
          </label>
          <input
            type="text"
            {...register("slug")}
            placeholder="sea-pearl-beach-resort"
            className={inputCls(!!errors.slug)}
          />
          <FieldError msg={errors.slug?.message} />
        </div>
      </div>

      {/* Location + Price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Location
            </span>
          </label>
          <input
            type="text"
            {...register("location")}
            placeholder="Cox's Bazar"
            className={inputCls(!!errors.location)}
          />
          <FieldError msg={errors.location?.message} />
        </div>
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
      </div>

      {/* Description */}
      <div>
        <label className={labelCls()}>Description</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe your hotel — location, ambiance, what makes it special…"
          className={inputCls(!!errors.description)}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      {/* Tags + Amenities */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" /> Tags{" "}
              <span className="font-normal text-gray-400">
                (comma-separated)
              </span>
            </span>
          </label>
          <input
            type="text"
            {...register("tags")}
            placeholder="beachfront, luxury, family"
            className={inputCls()}
          />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Amenities{" "}
              <span className="font-normal text-gray-400">
                (comma-separated)
              </span>
            </span>
          </label>
          <input
            type="text"
            {...register("amenities")}
            placeholder="WiFi, Pool, Spa, Parking"
            className={inputCls()}
          />
        </div>
      </div>

      {/* Image */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Cover Image
          </span>
        </label>
        <div
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${imageError ? "border-red-400 bg-red-50 dark:bg-red-950/20" : "border-gray-200 bg-gray-50 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-800/50"}`}
        >
          {imagePreview ? (
            <div className="relative w-full">
              <div className="relative mx-auto h-40 max-w-xs overflow-hidden rounded-xl">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  if (imageRef.current) imageRef.current.value = "";
                }}
                className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Click or drag to upload
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG or WebP — max 10 MB
              </p>
            </>
          )}
          <input
            ref={imageRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setImageError("");
                setImagePreview(URL.createObjectURL(f));
              }
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
        <FieldError msg={imageError} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        {isSubmitting ? "Submitting…" : "Submit Hotel for Approval"}
      </button>
    </form>
  );
}
