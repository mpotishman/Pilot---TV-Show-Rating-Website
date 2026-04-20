import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function SimilarCard({ similarInfo }) {
  const SimilarUrl = similarInfoInfo?.profile_path
    ? `https://image.tmdb.org/t/p/w780${similarInfo.profile_path}`
    : "/images/hero.jpg";


  return (
    <article className="w-full bg-[#161d29] border border-white/5 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
      <div className="relative w-full aspect-[2/3.2]">
        <Image
          src={SimilarUrl}
          alt={similarInfo.name || "Profile"}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover object-top"
        />

        {/* Overlay div at the bottom of the image */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#161d29] p-3 flex flex-col">
          <h3 className="text-white font-semibold text-2xl ">{castInfo.name}</h3>
          <p className="text-customGrey text-lg truncate">{character}</p>
        </div>
      
      </div>
    </article>
  );
}


