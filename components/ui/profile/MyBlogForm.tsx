"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Video,
  Tag,
  Clock,
  User,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import BlogRichEditor from "@/components/ui/BlogRichEditor";
import {
  blogImageUrl,
  createMyBlog,
  getMyBlog,
  updateMyBlog,
  uploadContentImage,
} from "@/lib/affiliateBlogs";

const CATEGORIES = [
  "Destination Guide",
  "Travel Tips",
  "Hotel Reviews",
  "News",
];

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface FormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  youtubeUrl: string;
  authorTitle: string;
  authorDetails: string;
  tags: string;
}

const DEFAULTS: FormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  readTime: "",
  youtubeUrl: "",
  authorTitle: "",
  authorDetails: "",
  tags: "",
};

interface Props {
  id?: string;
  onCancel: () => void;
  onSaved: () => void;
}

export default function MyBlogForm({ id, onCancel, onSaved }: Props) {
  const { token } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: DEFAULTS,
  });

  const titleValue = watch("title");
  const contentValue = watch("content");

  // Auto-generate slug from title while user hasn't typed in the slug.
  useEffect(() => {
    if (!isEdit && !slugManuallyEdited && titleValue) {
      setValue("slug", toSlug(titleValue), { shouldValidate: false });
    }
  }, [titleValue, isEdit, slugManuallyEdited, setValue]);

  // Pre-fill in edit mode
  useEffect(() => {
    if (!id || !token) return;
    void (async () => {
      try {
        const blog = await getMyBlog(token, id);
        reset({
          title: blog.title ?? "",
          slug: blog.slug ?? "",
          excerpt: blog.excerpt ?? "",
          content: blog.content ?? "",
          category: blog.category ?? "",
          readTime: String(blog.readTime ?? ""),
          youtubeUrl: blog.youtubeUrl ?? "",
          authorTitle: blog.authorTitle ?? "",
          authorDetails: blog.authorDetails ?? "",
          tags: (blog.tags ?? []).join(", "),
        });
        if (blog.coverImage) setImagePreview(blogImageUrl(blog.coverImage));
        setSlugManuallyEdited(true);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load post");
        onCancel();
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token, reset, onCancel]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError("");
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleContentImageUpload = async (file: File) => {
    if (!token) return null;
    try {
      return await uploadContentImage(token, file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
      return null;
    }
  };

  const splitList = (val: string) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const onSubmit = async (data: FormValues) => {
    if (!token) return;
    if (!isEdit && !imageFile) {
      setImageError("Cover image is required");
      return;
    }

    const fd = new FormData();
    fd.append("title", data.title);
    if (data.slug) fd.append("slug", data.slug);
    fd.append("excerpt", data.excerpt);
    fd.append("content", data.content);
    fd.append("readTime", data.readTime);
    if (data.category) fd.append("category", data.category);
    if (data.youtubeUrl) fd.append("youtubeUrl", data.youtubeUrl);
    if (data.authorTitle) fd.append("authorTitle", data.authorTitle);
    if (data.authorDetails) fd.append("authorDetails", data.authorDetails);
    splitList(data.tags).forEach((t) => fd.append("tags", t));
    if (imageFile) fd.append("coverImage", imageFile);

    try {
      setSubmitting(true);
      if (isEdit && id) {
        await updateMyBlog(token, id, fd);
        toast.success("Post updated");
      } else {
        await createMyBlog(token, fd);
        toast.success("Submitted for review!");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-primary-600" />
      </div>
    );
  }

  const labelClass =
    "mb-1.5 block text-sm font-medium text-black dark:text-gray-300";
  const inputClass =
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-black placeholder-gray-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-800 dark:text-white";
  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-black transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white">
            {isEdit ? "Edit Draft" : "New Blog Post"}
          </h2>
          <p className="mt-1 text-sm text-black dark:text-gray-400">
            {isEdit
              ? "Update your draft. It will be reviewed again before publishing."
              : "Share your story. An admin will review and publish it."}
          </p>
        </div>
      </div>

      {/* Always-draft notice */}
      <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Your post will be saved as a <strong>draft</strong>. It only goes live
          once an admin reviews and publishes it.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Main content — 2/3 width ── */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <div className={`${cardClass} space-y-4`}>
              <h3 className="text-sm font-semibold text-black dark:text-white">
                Basic Information
              </h3>

              <div>
                <label className={labelClass}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  className={`${inputClass} ${errors.title ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
                  placeholder="e.g. Top 5 Beach Destinations in Bangladesh"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  className={`${inputClass} font-mono text-xs ${errors.slug ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
                  placeholder="top-5-beach-destinations"
                  {...register("slug", {
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: "Lowercase letters, numbers and hyphens only",
                    },
                    onChange: () => setSlugManuallyEdited(true),
                  })}
                />
                {errors.slug ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.slug.message}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-black">
                    Auto-generated from title. Used in the URL.
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`${inputClass} min-h-20 resize-y ${errors.excerpt ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
                  placeholder="A short summary readers see in the blog list."
                  {...register("excerpt", {
                    required: "Excerpt is required",
                    minLength: { value: 10, message: "At least 10 characters" },
                  })}
                />
                {errors.excerpt && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className={`${cardClass} space-y-4`}>
              <h3 className="text-sm font-semibold text-black dark:text-white">
                Content
              </h3>
              <div>
                <label className={labelClass}>
                  Body <span className="text-red-500">*</span>
                </label>
                {/* Hidden input keeps RHF validation wired up */}
                <input
                  type="hidden"
                  {...register("content", {
                    required: "Content is required",
                    validate: (v) =>
                      (v && v.replace(/<[^>]*>/g, "").trim().length >= 20) ||
                      "At least 20 characters required",
                  })}
                />
                <BlogRichEditor
                  value={contentValue}
                  onChange={(html) =>
                    setValue("content", html, { shouldValidate: true })
                  }
                  hasError={!!errors.content}
                  onUploadImage={handleContentImageUpload}
                />
                {errors.content && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.content.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-black">
                  Use the image button in the toolbar to insert pictures anywhere
                  in the post.
                </p>
              </div>
            </div>

            {/* Cover Image */}
            <div className={`${cardClass} space-y-3`}>
              <h3 className="text-sm font-semibold text-black dark:text-white">
                Cover Image{" "}
                {!isEdit && <span className="text-red-500">*</span>}
              </h3>

              {imagePreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors hover:border-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 ${
                    imageError
                      ? "border-red-400 bg-red-50/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <Upload className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black dark:text-gray-200">
                      Click to upload cover image
                    </p>
                    <p className="text-xs text-black">
                      JPEG, PNG or WebP — max 10 MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              {imageError && (
                <p className="text-xs text-red-500">{imageError}</p>
              )}
            </div>

            {/* Author Details */}
            <div className={`${cardClass} space-y-4`}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                <User className="h-3.5 w-3.5 text-black" /> Author Details
              </h3>

              <div>
                <label className={labelClass}>Author Title</label>
                <input
                  className={`${inputClass} border-gray-200 dark:border-gray-700`}
                  placeholder="e.g. Travel Writer"
                  {...register("authorTitle")}
                />
                <p className="mt-1 text-xs text-black">
                  Shown below your name. Your name comes from your profile.
                </p>
              </div>

              <div>
                <label className={labelClass}>About the Author</label>
                <textarea
                  className={`${inputClass} min-h-28 resize-y border-gray-200 dark:border-gray-700`}
                  placeholder="A short bio — background, expertise, where you're based, etc."
                  {...register("authorDetails")}
                />
                <p className="mt-1 text-xs text-black">
                  Free-form text displayed in an &ldquo;About the Author&rdquo;
                  box at the end of the post.
                </p>
              </div>
            </div>
          </div>

          {/* ── Sidebar — 1/3 width ── */}
          <div className="space-y-6">
            {/* Actions */}
            <div className={`${cardClass} space-y-4`}>
              <h3 className="text-sm font-semibold text-black dark:text-white">
                Submission
              </h3>
              <p className="text-xs text-black dark:text-gray-400">
                Posts go to admin review. They will appear on the public blog
                once an admin publishes them.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isEdit ? "Save Changes" : "Submit for Review"}
                </button>
              </div>
            </div>

            {/* Post Details */}
            <div className={`${cardClass} space-y-4`}>
              <h3 className="text-sm font-semibold text-black dark:text-white">
                Post Details
              </h3>

              <div>
                <label className={labelClass}>Category</label>
                <select
                  className={`${inputClass} border-gray-200 dark:border-gray-700`}
                  {...register("category")}
                >
                  <option value="">No category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`${labelClass} flex items-center gap-1.5`}
                >
                  <Clock className="h-3 w-3 text-black" />
                  Read Time (minutes){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  className={`${inputClass} ${errors.readTime ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
                  placeholder="6"
                  {...register("readTime", {
                    required: "Read time is required",
                    min: { value: 1, message: "Minimum 1 minute" },
                  })}
                />
                {errors.readTime && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.readTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags & YouTube */}
            <div className={`${cardClass} space-y-4`}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                <Tag className="h-3.5 w-3.5 text-black" /> Tags &amp; Media
              </h3>

              <div>
                <label className={labelClass}>
                  Tags{" "}
                  <span className="text-xs font-normal text-black">
                    (comma-separated)
                  </span>
                </label>
                <input
                  className={`${inputClass} border-gray-200 dark:border-gray-700`}
                  placeholder="beach, travel, bangladesh"
                  {...register("tags")}
                />
              </div>

              <div>
                <label
                  className={`${labelClass} flex items-center gap-1.5`}
                >
                  <Video className="h-3 w-3 text-red-500" />
                  YouTube URL
                </label>
                <input
                  className={`${inputClass} ${errors.youtubeUrl ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...register("youtubeUrl", {
                    pattern: {
                      value: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
                      message: "Enter a valid YouTube URL",
                    },
                  })}
                />
                {errors.youtubeUrl && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.youtubeUrl.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
