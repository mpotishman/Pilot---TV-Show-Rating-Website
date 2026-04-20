import React from "react";
import Image from "next/image";

export default function EpisodeDescriptionSection({onClick, episodeInfo}) {
  
  return (
    <>
      <div className="top-section flex justify-between">
        <div className="text-3xl tracking-tight font-bold">Rate Episode</div>
        <button onClick={onClick}>X</button>
      </div>

      <div className="border-t border-gray-700 w-full "></div>

      <div className="flex flex-col gap-2 font-bold tracking-tight ">
        <div className="w-full">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w780${episodeInfo.still_path}`}
              alt={episodeInfo.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <p className="text-sm text-highlight mt-2">
          S{episodeInfo.season_number} E{episodeInfo.episode_number}
        </p>

        <p className="text-white text-2xl font-bold ">{episodeInfo.name}</p>

        <p className="text-sm text-customGrey">{episodeInfo.overview}</p>
      </div>
    </>
  );
}
