import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ShowSimilarSection({ similarInfo }) {
  const shows = similarInfo?.results ?? [];

  if (shows.length === 0) {
    return <p className="text-customGrey text-center mt-8">No similar shows found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {shows.map((show) => {
        const imageUrl = show.poster_path
          ? `https://image.tmdb.org/t/p/w342${show.poster_path}`
          : "/images/hero.jpg";
        return (
          <Link key={show.id} href={`/shows/${show.id}?tab=episodes&season=1`}>
            <article className="w-full bg-[#161d29] border border-white/5 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="relative w-full aspect-[2/3]">
                <Image
                  src={imageUrl}
                  alt={show.name || "Show poster"}
                  fill
                  sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm truncate">{show.name}</h3>
                {show.first_air_date && (
                  <p className="text-customGrey text-xs">{show.first_air_date.slice(0, 4)}</p>
                )}
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
