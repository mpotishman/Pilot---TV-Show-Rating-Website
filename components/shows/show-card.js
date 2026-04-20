"use client";
// components/show-card.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ShowCard({ show, type, username }) {
  const posterUrl = show?.poster_path
    ? `https://image.tmdb.org/t/p/w780${show.poster_path}`
    : "/images/hero.jpg";
  
  const pathname = usePathname();

  // Build href based on whether username exists
  const showHref = username 
    ? `/${username}/shows/${show.id}?tab=episodes&season=1`
    : `/shows/${show.id}?tab=episodes&season=1`;

  if (type === "small") {
    return (
      <Link href={showHref}> {/* Fixed: added curly braces, removed scroll={true} */}
        <div className="relative aspect-[2/3.8] w-[140px] min-w-[140px] md:w-[160px] md:min-w-[160px] rounded-md overflow-hidden bg-slate-800"> {/* Fixed typo: 40px -> 160px */}
          <Image
            src={posterUrl}
            alt={show?.name || show?.title || "Show poster"}
            fill
            sizes="(max-width: 768px) 140px, 160px"
            className="object-cover object-top"
          />
        </div>
      </Link>
    );
  } else {
    return (
      <article className="w-full bg-[#161d29] border border-white/5 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
        <Link href={showHref}> {/* Fixed: added curly braces */}
          <div className="relative w-full aspect-[2/3.2]">
            <Image
              src={posterUrl}
              alt={show?.name || show?.title || "Show poster"}
              fill
              sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 100vw"
              className="object-cover object-top"
            />
          </div>
        </Link>
      </article>
    );
  }
}