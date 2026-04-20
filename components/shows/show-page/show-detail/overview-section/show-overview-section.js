"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function ShowOverviewSection({ showInfo }) {
  console.log("OVERVIEW: ", showInfo.episode_run_time);

  function getLanguageName(code) {
    try {
      return new Intl.DisplayNames(["en"], { type: "language" }).of(code);
    } catch {
      return code; // fallback if something weird happens
    }
  }

  function getCountryName(code) {
    try {
      return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    } catch {
      return code; // fallback
    }
  }

  return (
    <section className="flex flex-col items-center p-4">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Tagline  */}
        <div className="text-highlight text-2xl italic mt-8 font-bold tracking-tight text-center">
          {showInfo.tagline || ""}
        </div>

        {/* Synopsis */}
        <div className="bg-[#161d29] rounded-2xl flex flex-col p-4 mt-4 gap-4 w-full">
          <span className="text-white text-2xl font-bold tracking-tight">
            Synopsis
          </span>
          <p>{showInfo.overview}</p>
        </div>

        {/* Show information */}
        <div className="bg-[#161d29] rounded-2xl flex flex-col p-4 mt-4 w-full">
          <span className="text-white text-2xl font-bold tracking-tight">
            Show Information
          </span>
          <hr className="mt-1 text-customGrey"></hr>

          <span className="mt-4 font-bold tracking-tight text-customGrey text-sm">
            STATUS
          </span>
          <div
            className={`mt-1 inline-block w-fit  text-sm px-2 py-1 rounded-4xl ${
              showInfo.status === "Ended"
                ? "bg-[rgba(156,163,175,0.2)] text-customGrey"
                : "bg-highlight text-white font-bold tracking-tight"
            }`}
          >
            {showInfo.status}
          </div>

          <span className="mt-4 font-bold tracking-tight text-customGrey text-sm">
            NETWORK
          </span>
          <div className=" font-bold tracking-tight mt-1 inline-block w-fit text-black text-sm px-2 py-1 rounded-sm bg-white">
            {showInfo.production_companies
              .slice(0, 1)
              .map((c) => c.name.toUpperCase())
              .join(", ")}
          </div>

          <span className="mt-4 font-bold tracking-tight text-customGrey text-sm">
            TYPE
          </span>
          <span className="font-bold tracking-tight text-white">
            {showInfo.type}
          </span>

          <span className="mt-4 font-bold tracking-tight text-customGrey text-sm">
            ORIGINAL LANGUAGE
          </span>
          <span className="font-bold tracking-tight text-white">
            {getLanguageName(showInfo.original_language)}
          </span>

          <span className="mt-4 font-bold tracking-tight text-customGrey text-sm">
            TOTAL EPISODES
          </span>
          <span className="font-bold tracking-tight text-white">
            {showInfo.number_of_episodes} episodes
          </span>

          <span className="mt-4 font-bold tracking-tight text-customGrey text-sm">
            FIRST AIRED
          </span>
          <span className="font-bold tracking-tight text-white">
            {new Date(showInfo.first_air_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>

          <span className="mt-4 font-bold tracking-tight text-customGrey text-sm">
            LAST AIRED
          </span>
          <span className="font-bold tracking-tight text-white">
            {new Date(showInfo.last_air_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>

          <span className="mt-4 font-bold tracking-tight text-customGrey text-sm">
            COUNTRY
          </span>
          <span className="font-bold tracking-tight text-white">
            {getCountryName(showInfo.origin_country)}
          </span>

          <span className="mt-4 font-bold tracking-tight text-customGrey text-sm">
            OFFICIAL WEBSITE
          </span>
          <button className="mt-1 inline-block w-fit  text-sm px-2 py-1 rounded-sm bg-highlight font-bold tracking-tight">
            <Link href={showInfo.homepage}>
              Visit {showInfo.networks?.[0]?.name} →
            </Link>
          </button>
        </div>

        {/* Created By */}
        <div className="bg-[#161d29] rounded-2xl flex flex-col p-4 mt-4 w-full">
          <span className="text-white text-2xl font-bold tracking-tight">
            Created By
          </span>
          <hr className="mt-1 text-customGrey"></hr>
          <div className="flex flex-col gap-4 mt-4">
            {" "}
            {/* Changed back to flex-col */}
            {showInfo.created_by.map((creator) => (
              <div
                className="flex flex-row items-center gap-2"
                key={creator.id}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w185${creator.profile_path}`} // Fixed backticks
                  alt={creator.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover aspect-square"
                />
                <span className="text-white  font-bold tracking-tight text-sm">
                  {creator.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Production Companies */}
        <div className="bg-[#161d29] font-bold text-white tracking-tight p-4 w-full mt-4 rounded-2xl">
          <span className="text-white text-2xl font-bold tracking-tight">
            Production Companies
          </span>
          <hr className="w-full mt-1 border-t border-customGrey" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {showInfo.production_companies.map((company) => (
              <div
                className="flex flex-row items-center gap-4 bg-[#1f2937] font-bold text-white tracking-tight p-4 rounded-2xl"
                key={company.id}
              >
                {company.logo_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${company.logo_path}`} // Fixed backticks
                    alt={company.name}
                    width={50}
                    height={50}
                    className="rounded-2xl object-contain aspect-square" // Changed to object-contain
                  />
                )}
                <span>{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Community Rating */}
        <div className="bg-[#161d29] font-bold text-white tracking-tight p-4 w-full mt-4 rounded-2xl flex flex-col items-center">
          <span className="text-2xl mt-4 text-center">Community Rating</span>

          <div className="text-4xl mt-4 text-highlight">{showInfo.vote_average.toFixed(1)}<span className="text-2xl text-customGrey">/10</span></div>

          <span className="text-customGrey mt-4">Based on {showInfo.vote_count} ratings</span>

        </div>
      </div>
    </section>
  );
}
