import React from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function IndividualEpisodes({
  episode,
  onClick,
  season,
  currentEpisode,
  ratingData,
}) {
  const rating = ratingData?.rating; // ← use optional chaining
  const review = ratingData?.review;

  return (
    <button
      onClick={onClick}
      className="bg-[#1f2937] flex flex-col md:flex-row gap-4 p-8 rounded-2xl md:justify-between md:items-center w-full"
    >
      {/* Left side: Image, Title, Date */}
      <div className="flex gap-4 flex-1">
        <div className="rounded-2xl flex-shrink-0">
          {episode.still_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w780${episode.still_path}`}
              alt={episode.name}
              width={200}
              height={69}
              className="object-cover rounded-2xl"
            />
          ) : (
            <div className="w-[300px] h-[169px] bg-gray-800 flex items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-highlight text-sm font-semibold mb-1 text-left">
            S{season} E{currentEpisode}
          </div>
          <div className="text-white font-bold text-lg mb-1 text-left">
            {episode.name}
          </div>
          <div className="text-sm text-customGrey text-left">
            {new Date(episode.air_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Right side: Rating */}
      <div className="shrink-0">
        {rating && (
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`text-sm ${
                    n <= rating ? "text-highlight" : "text-gray-600"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {review && <MessageCircle size={14} className="text-highlight" />}
          </div>
        )}
      </div>
    </button>
  );
}
