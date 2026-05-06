"use client";

import { useState } from "react";
import { Star, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";
import type { Review } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

interface ReviewFormProps {
  hotelId: string;
  bookingId?: string;
  onReviewPosted?: (review: Review) => void;
}

export function ReviewForm({ hotelId, bookingId, onReviewPosted }: ReviewFormProps) {
  const { token } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!token) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
        <LogIn className="h-4 w-4 shrink-0 text-gray-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/auth/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary-200 bg-primary-50 p-6 text-center dark:border-primary-900/40 dark:bg-primary-950/20">
        <p className="font-semibold text-primary-700 dark:text-primary-400">
          Thank you for your review!
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your feedback helps other travelers make informed decisions.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") return;
    setLoading(true);
    try {
      const body: Record<string, unknown> = { hotelId, rating, comment };
      if (bookingId) body.bookingId = bookingId;
      const res = await fetch(`${BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to post review");
      toast.success("Review posted!");
      setSubmitted(true);
      onReviewPosted?.({
        id: json.id,
        author: json.author,
        rating: json.rating,
        comment: json.comment,
        createdAt: json.createdAt,
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not post review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your Review
        </label>
        <textarea
          id="review-comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with other travelers..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={rating === 0 || comment.trim() === "" || loading}
        >
          {loading ? "Posting…" : "Post Review"}
        </Button>
      </div>
    </form>
  );
}
