// ShowTopSection.js
"use client";
import TabButtons from "@/components/buttons/tab-buttons";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useActionState } from "react";
import { useState } from "react";

import { Star } from "lucide-react";
import { getCurrentCacheVersion } from "next/dist/client/components/segment-cache-impl/cache";
import { getCurrentUser } from "@/lib/auth";
import addShowToWatchlist from "@/actions/watchlist-actions";

export default function ShowTopSection({
  show,
  showId,
  isLoggedIn,
  userId,
  isOwnProfile,
  allUserInfo,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //   Debug statements
  //   console.log("Show name:", show.name);
  //   console.log("Show seasons:", show.number_of_seasons);
  //   console.log("Show air_date:", show.first_air_date);

  // destructure show to get some values
  let { name, overview, genres, first_air_date, number_of_seasons } = show;

  // reformat some of the values
  first_air_date = first_air_date.slice(0, 4);
  // loop through genres - label each as 'g', eg for g in genres, then return g.name for each and add a comma and space
  genres = genres
    .slice(0, 3)
    .map((g) => g.name)
    .join(", ");

  // find out what active tab the user is on, and create a function that updates the router to a new path including that tab pressed
  const activeTab = searchParams.get("tab") || "episodes";
  const handleTabClick = (tab) => {
    router.push(`${pathname}?tab=${tab}`, { scroll: true });
  };

  // set logic for the watchlisting, when user presses the watchlist button, it changes state of watchlisted
  const [state, formAction] = useActionState(addShowToWatchlist, {})
  let { initialWatchlistStatus } = allUserInfo;
  const [watchlisted, setWatchlistStatus] = useState(initialWatchlistStatus);

  return (
    <section className="w-full flex flex-col items-center">
      {/* Backdrop container with max width, set to relative so other divs can be inside it */}
      <div className="relative h-[500px] w-full max-w-7xl flex items-end overflow-hidden">
        {show?.backdrop_path ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
              alt={show.name ?? show.title ?? "show backdrop"}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-top"
              quality={100}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white">
            No image available
          </div>
        )}

        {/* This div now encompasses the entirity of its parent div (line 31) with inset-0 - ADDS GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to transparent" />

        {/* now to do the same as above but to allow for text */}
        <div className="absolute inset-0 flex flex-col p-8 justify-end gap-4 ">
          <div className="title-and-watchlist flex items-center gap-4">
            <div className="text-5xl md:text-6xl font-bold tracking-tight">
             {name}
            </div>

            <div className="watchlist-icon ">
              <form action={formAction}>
                <input type="hidden" name="showId" value={showId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="show_name" value={show.name} />
                <input
                  type="hidden"
                  name="username"
                  value={allUserInfo.currentUserUsername}
                />
                <input
                  type="hidden"
                  name="already-watchlisted"
                  value={initialWatchlistStatus ? "1" : ""}
                />
                <button
                  type="submit"
                  onClick={() => setWatchlistStatus(!watchlisted)}
                  className="cursor-pointer"
                >
                  <Star
                    size={24}
                    className={`cursor-pointer transition-all ${
                      watchlisted
                        ? "fill-highlight text-highlight"
                        : "text-white/60"
                    }`}
                  />
                </button>
              </form>
            </div>
          </div>

          <div className="mt-2 w-full text-l md:text-xl tracking-tight text-gray-400">
            {first_air_date} • {genres} • {number_of_seasons} seasons
          </div>
          <div className="mt-2 text-l md:text-xl text-gray-300 tracking-tight mb-16">
            {overview}
          </div>

          {/* now for div to be at the bottom, then inside will be the other buttons */}
          <div className="absolute bottom-0 left-0 w-full flex gap-4 max-w-7xl px-4 justify-center border-b border-zinc-700">
            <TabButtons
              active={activeTab === "episodes"}
              onClick={() => handleTabClick("episodes")}
            >
              Episodes
            </TabButtons>

            <TabButtons
              active={activeTab === "overview"}
              onClick={() => handleTabClick("overview")}
            >
              Overview
            </TabButtons>

            <TabButtons
              active={activeTab === "cast"}
              onClick={() => handleTabClick("cast")}
            >
              Cast
            </TabButtons>

            <TabButtons
              active={activeTab === "similar"}
              onClick={() => handleTabClick("similar")}
            >
              Similar Shows
            </TabButtons>
          </div>
        </div>
      </div>
    </section>
  );
}
