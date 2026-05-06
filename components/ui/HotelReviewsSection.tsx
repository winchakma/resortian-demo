import { Star } from "lucide-react";
import type { Review } from "@/types";

interface HotelReviewsSectionProps {
  reviews: Review[];
}

export function HotelReviewsSection({ reviews }: HotelReviewsSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-8 flex items-center gap-2">
        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Guest Reviews
        </h2>
        <span className="ml-1 text-sm text-gray-400 dark:text-gray-500">
          ({reviews.length})
        </span>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {review.author}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No reviews yet.
        </p>
      )}
    </div>
  );
}
