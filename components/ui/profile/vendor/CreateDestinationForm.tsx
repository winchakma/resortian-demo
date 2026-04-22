import { useAuth } from "@/context/AuthContext";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BASE, inputCls, labelCls } from "@/utils";
import toast from "react-hot-toast";
import { Globe, MapPin, Sparkles, Upload, X } from "lucide-react";
import * as yup from "yup";
import FieldError from "@/components/common/FieldError";
import Image from "next/image";

const destinationSchema = yup.object({
  name: yup.string().required("Destination name is required"),
  region: yup.string().required("Region is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "At least 20 characters"),
  highlights: yup.string(),
});

type DestinationFormValues = {
  name: string;
  region: string;
  description: string;
  highlights?: string;
};

export default function CreateDestinationForm({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const { token } = useAuth();
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DestinationFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(destinationSchema) as any,
    mode: "onTouched",
  });

  async function onSubmit(data: DestinationFormValues) {
    const file = imageRef.current?.files?.[0];
    if (!file) {
      setImageError("Please select a destination image");
      return;
    }

    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("region", data.region);
    fd.append("description", data.description);
    data.highlights
      ?.split(",")
      .map((h) => h.trim())
      .filter(Boolean)
      .forEach((h) => fd.append("highlights", h));
    fd.append("image", file);

    try {
      const res = await fetch(`${BASE}/destinations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.message || "Failed to create destination");
      reset();
      if (imageRef.current) imageRef.current.value = "";
      setImagePreview(null);
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
      {/* Name + Region */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Destination Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Cox's Bazar"
            className={inputCls(!!errors.name)}
          />
          <FieldError msg={errors.name?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Region
            </span>
          </label>
          <input
            type="text"
            {...register("region")}
            placeholder="Chittagong Division"
            className={inputCls(!!errors.region)}
          />
          <FieldError msg={errors.region?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls()}>Description</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe the destination — geography, culture, what makes it special…"
          className={inputCls(!!errors.description)}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      {/* Highlights */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Highlights
            <span className="font-normal text-gray-400">(comma-separated)</span>
          </span>
        </label>
        <input
          type="text"
          {...register("highlights")}
          placeholder="World's longest beach, Coral reefs, Sunset views"
          className={inputCls()}
        />
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
        <Globe className="h-4 w-4" />
        {isSubmitting ? "Submitting…" : "Submit Destination for Approval"}
      </button>
    </form>
  );
}
