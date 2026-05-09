import FieldError from "@/components/common/FieldError";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useAuth } from "@/context/AuthContext";
import { VendorHotel } from "@/types";
import { BASE, inputCls, labelCls } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Clock,
  FileText,
  MapPin,
  Pencil,
  Sparkles,
  Tag,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

type UpdateHotelFormValues = {
  name: string;
  slug: string;
  location: string;
  description: string;
  price: number;
  tags?: string;
  amenities?: string;
  checkinTime?: string;
  checkoutTime?: string;
  bookingConditions?: string;
  isActive?: boolean;
};

const updateHotelSchema = yup.object({
  name: yup.string().required("Property name is required"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
  location: yup.string().required("Location is required"),
  description: yup
    .string()
    .required("Description is required")
    .test("min-length", "At least 20 characters", (v) => (v?.replace(/<[^>]*>/g, "") ?? "").length >= 20),
  price: yup
    .number()
    .typeError("Must be a number")
    .required("Price is required")
    .min(1, "Must be positive"),
  tags: yup.string(),
  amenities: yup.string(),
  checkinTime: yup.string().required("Check-in time is required"),
  checkoutTime: yup.string().required("Check-out time is required"),
  bookingConditions: yup.string(),
  isActive: yup.boolean(),
});

export default function EditHotelForm({
  hotel,
  onUpdated,
}: {
  hotel: VendorHotel;
  onUpdated: () => void;
}) {
  const { token } = useAuth();
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateHotelFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(updateHotelSchema) as any,
    mode: "onTouched",
    defaultValues: {
      name: hotel.name,
      slug: hotel.slug,
      location: hotel.location,
      description: hotel.description,
      price: hotel.price,
      tags: hotel.tags?.join(", ") ?? "",
      amenities: hotel.amenities?.join(", ") ?? "",
      checkinTime: hotel.checkinTime ?? "",
      checkoutTime: hotel.checkoutTime ?? "",
      bookingConditions: hotel.bookingConditions ?? "",
      isActive: hotel.isActive,
    },
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

  async function onSubmit(data: UpdateHotelFormValues) {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("slug", data.slug);
    fd.append("location", data.location);
    fd.append("description", data.description);
    fd.append("price", String(data.price));
    fd.append("isActive", data.isActive ? "true" : "false");
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
    if (data.checkinTime) fd.append("checkinTime", data.checkinTime);
    if (data.checkoutTime) fd.append("checkoutTime", data.checkoutTime);
    if (data.bookingConditions) fd.append("bookingConditions", data.bookingConditions);
    const file = imageRef.current?.files?.[0];
    if (file) fd.append("image", file);

    try {
      const res = await fetch(`${BASE}/hotels/${hotel.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update hotel");
      if (imageRef.current) imageRef.current.value = "";
      setImagePreview(null);
      onUpdated();
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
      {/* Name + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Property Name</label>
          <input
            type="text"
            {...register("name")}
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
            min={1}
            className={inputCls(!!errors.price)}
          />
          <FieldError msg={errors.price?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls()}>Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Describe your hotel — location, ambiance, what makes it special…"
              hasError={!!errors.description}
              minHeight={140}
            />
          )}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      {/* Tags + Amenities */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" /> Tags{" "}
              <span className="font-normal text-gray-400">(comma-separated)</span>
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
              <span className="font-normal text-gray-400">(comma-separated)</span>
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

      {/* Check-in / Check-out Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Check-in Time
            </span>
          </label>
          <input
            type="time"
            {...register("checkinTime")}
            className={inputCls(!!errors.checkinTime)}
          />
          <FieldError msg={errors.checkinTime?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Check-out Time
            </span>
          </label>
          <input
            type="time"
            {...register("checkoutTime")}
            className={inputCls(!!errors.checkoutTime)}
          />
          <FieldError msg={errors.checkoutTime?.message} />
        </div>
      </div>

      {/* Booking Conditions */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Booking Conditions{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </span>
        </label>
        <Controller
          name="bookingConditions"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Cancellation policy, payment terms, house rules…"
              hasError={!!errors.bookingConditions}
              minHeight={120}
            />
          )}
        />
        <FieldError msg={errors.bookingConditions?.message} />
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Active
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Only active hotels are visible to guests
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            {...register("isActive")}
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-violet-600 peer-checked:after:translate-x-full dark:bg-gray-600" />
        </label>
      </div>

      {/* Image (optional) */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Cover Image{" "}
            <span className="font-normal text-gray-400">
              (leave empty to keep current)
            </span>
          </span>
        </label>
        <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 transition-colors hover:border-violet-400 dark:border-gray-700 dark:bg-gray-800/50">
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
            <div className="flex flex-col items-center">
              <div className="relative mx-auto mb-3 h-20 w-32 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
                {hotel.image && (
                  <Image
                    src={`${BASE}${hotel.image}`}
                    alt={hotel.name}
                    fill
                    unoptimized
                    className="object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Click to replace image
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG or WebP — max 10 MB
              </p>
            </div>
          )}
          <input
            ref={imageRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setImagePreview(URL.createObjectURL(f));
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Pencil className="h-4 w-4" />
        {isSubmitting ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
