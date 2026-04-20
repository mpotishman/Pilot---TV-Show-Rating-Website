import React from "react";
import Image from "next/image";

export default function RatingCard({ rating }) {
  const posterUrl = rating?.still_path
    ? `https://image.tmdb.org/t/p/w780${rating.still_path}`
    : "/images/hero.jpg";

  return (
    <div className="rating-card bg-sectionBackground p-6 rounded-lg flex gap-4 mb-4 w-full hover:bg-[#1a212f] transition-all hover:translate-x-1 duration-300">
      <div className="flex-shrink-0">
        {rating.still_path || rating.poster_path ? (
          <Image
            src={posterUrl}
            alt={rating?.name || rating?.title || "Show poster"}
            width={200}
            height={150}
            className="object-cover object-top rounded-lg"
          />
        ) : (
          <div className="w-[200px] h-[150px] bg-gray-800 flex items-center justify-center text-sm text-gray-400 rounded-lg">
            No image
          </div>
        )}
      </div>
      <div className="show-information flex flex-col justify-between flex-1 tracking-tight">
        <div>
          <p className="text-white text-lg font-semibold tracking-tight mb-2">
            {rating.name}
          </p>
          <p className="text-highlight text-sm mb-3">
            {rating.type === "episode" ? (
              <>
                S{rating.season_number}&nbsp;&nbsp;E{rating.episode_number} -{" "}
                {rating.episode_name}
              </>
            ) : (
              `Season ${rating.season_number} review`
            )}
          </p>
          {/* Rating Display */}
          {rating.type === "episode" ? (
            <>
              <div className="flex-shrink-0 flex flex-col justify-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`text-lg ${
                        n <= rating.rating ? "text-highlight" : "text-gray-600"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {rating.review && (
                  <p className="text-xs text-gray-400 italic">
                    &quot;{rating.review}&quot;
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {rating.season_review && (
                <p className="text-xs text-gray-400 italic">
                  &quot;{rating.season_review}&quot;
                </p>
              )}
            </>
          )}

          <p className="text-customGrey italic text-sm leading-relaxed line-clamp-2">
            {rating.overview}
          </p>
        </div>
      </div>
    </div>
  );
}
