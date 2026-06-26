import FieldError from "@/components/common/FieldError";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useAuth } from "@/context/AuthContext";
import { HotelFormValues } from "@/types";
import { BASE, inputCls, labelCls } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  FileText,
  MapPin,
  Plus,
  Search,
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

const hotelSchema = yup.object({
  destinationId: yup.string().required("Destination is required"),
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

  // Destination combobox
  const [destOpen, setDestOpen] = useState(false);
  const [destQuery, setDestQuery] = useState("");
  const [destLabel, setDestLabel] = useState("");
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestOpen(false);
        setDestQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
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

  // Load all public approved destinations
  useEffect(() => {
    fetch(`${BASE}/destinations?limit=100`)
      .then((r) => r.json())
      .then((d) => {
        setDestinations(d.data ?? d ?? []);
      })
      .catch(() => {});
  }, []);

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
    if (data.checkinTime) fd.append("checkinTime", data.checkinTime);
    if (data.checkoutTime) fd.append("checkoutTime", data.checkoutTime);
    if (data.bookingConditions) fd.append("bookingConditions", data.bookingConditions);
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
      setDestLabel("");
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
            {/* hidden field keeps react-hook-form in sync */}
            <input type="hidden" {...register("destinationId")} />

            <div ref={destRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setDestOpen((o) => !o);
                  setDestQuery("");
                }}
                className={[
                  inputCls(!!errors.destinationId),
                  "flex items-center justify-between cursor-pointer text-left",
                  destLabel ? "" : "text-black dark:text-gray-500",
                ].join(" ")}
              >
                <span className={destLabel ? "text-black dark:text-white" : ""}>
                  {destLabel || "Select a destination…"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-black transition-transform duration-150 ${destOpen ? "rotate-180" : ""}`}
                />
              </button>

              {destOpen && (
                <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  {/* Search input */}
                  <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
                    <Search className="h-3.5 w-3.5 shrink-0 text-black" />
                    <input
                      autoFocus
                      type="text"
                      value={destQuery}
                      onChange={(e) => setDestQuery(e.target.value)}
                      placeholder="Search destinations…"
                      className="w-full bg-transparent text-sm text-black placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500"
                    />
                    {destQuery && (
                      <button type="button" onClick={() => setDestQuery("")}>
                        <X className="h-3.5 w-3.5 text-black hover:text-gray-600 dark:hover:text-gray-200" />
                      </button>
                    )}
                  </div>

                  {/* Options list */}
                  <ul className="max-h-52 overflow-y-auto py-1">
                    {destinations
                      .filter((d) =>
                        d.name.toLowerCase().includes(destQuery.toLowerCase()),
                      )
                      .map((d) => {
                        const selected = destLabel === d.name;
                        return (
                          <li key={d.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setValue("destinationId", d.id, {
                                  shouldValidate: true,
                                });
                                setDestLabel(d.name);
                                setDestOpen(false);
                                setDestQuery("");
                              }}
                              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                                selected
                                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
                                  : "text-black hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                              }`}
                            >
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-black" />
                              <span className="flex-1">{d.name}</span>
                              {selected && (
                                <Check className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    {destinations.filter((d) =>
                      d.name.toLowerCase().includes(destQuery.toLowerCase()),
                    ).length === 0 && (
                      <li className="px-4 py-3 text-center text-sm text-black dark:text-gray-500">
                        No destinations found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <FieldError msg={errors.destinationId?.message} />
          </>
        )}
      </div>

      {/* Name + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Property Name</label>
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
            <span className="font-normal text-black">(auto-generated)</span>
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
        <Controller
          name="description"
          control={control}
          defaultValue=""
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
              <span className="font-normal text-black">
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
              <span className="font-normal text-black">
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
            <span className="font-normal text-black">(optional)</span>
          </span>
        </label>
        <Controller
          name="bookingConditions"
          control={control}
          defaultValue=""
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

      {/* Image */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Cover Image
          </span>
        </label>
        <div
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${imageError ? "border-red-400 bg-red-50 dark:bg-red-950/20" : "border-gray-200 bg-gray-50 hover:border-green-400 dark:border-gray-700 dark:bg-gray-800/50"}`}
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
              <p className="text-sm font-medium text-black dark:text-gray-400">
                Click or drag to upload
              </p>
              <p className="mt-1 text-xs text-black">
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
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        {isSubmitting ? "Submitting…" : "Submit Property for Approval"}
      </button>
    </form>
  );
}
