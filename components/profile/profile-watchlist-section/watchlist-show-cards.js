import React from "react";
import Image from "next/image";

export default function WatchlistShowCard({ showInfo }) {
  const posterUrl = showInfo?.poster_path
    ? `https://image.tmdb.org/t/p/w780${showInfo.poster_path}`
    : "/images/hero.jpg"

  let genres = showInfo?.genres
    ?.slice(0, 3)
    .map(g => g.name)
    .join(", ")

  return (
    <div className="flex gap-4 bg-[#161d29] w-full max-w-4xl p-6 rounded-lg hover:bg-[#1a212f] transition-all hover:translate-x-1 duration-300">
      {/* Poster Image */}
      <div className="flex-shrink-0">
        <Image
          src={posterUrl}
          alt={showInfo?.name || showInfo?.title || "Show poster"}
          width={100}
          height={150}
          className="object-cover object-top rounded-lg"
        />
      </div>

      {/* Show Information */}
      <div className="show-information flex flex-col justify-between flex-1">
        <div>
          <p className="text-white text-lg font-semibold tracking-tight mb-2">
            {showInfo?.name || showInfo?.title}
          </p>
          <p className="text-gray-400 text-sm mb-3">
            {genres} • {showInfo?.number_of_seasons} seasons
          </p>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
            {showInfo?.overview}
          </p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex-shrink-0 flex items-center">
        <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors">
          + Add
        </button>
      </div>
    </div>
  )
}