"use client";
import React, { useState, useEffect } from "react";
import IndividualEpisodes from "./individual-episodes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ModalContainer from "@/components/modal/modal-container";

// useActionState comes from react in your setup
import { useActionState } from "react";
import { submitSeasonRating } from "@/actions/rating-actions";

export default function SeasonEpisodesDisplay({ allUserInfo, allShowInfo }) {
  const { seasonInfo } = allShowInfo;
  const allUserRatings = allUserInfo?.allShowRatings ?? {};

  // useActionState for server action form handling (season reviews)
  const [state, formAction, isPending] = useActionState(submitSeasonRating, {});

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Prefer URL param, otherwise fallback to prop's season number
  const rawSeasonParam = searchParams.get("season");
  const seasonNumber = rawSeasonParam
    ? Number(rawSeasonParam)
    : seasonInfo?.season_number
    ? Number(seasonInfo.season_number)
    : NaN;

  // Ensure seasonNumber is a valid number before using it
  const validSeasonNumber = Number.isFinite(seasonNumber) ? seasonNumber : null;

  // Safely get the average
  const averageSeasonRating =
    validSeasonNumber && allUserRatings && allUserRatings[validSeasonNumber]
      ? allUserRatings[validSeasonNumber].average
      : null;

  const isEpisodeWatchedRating = (season, episode_num) => {
    if (
      allUserRatings &&
      allUserRatings[season] &&
      allUserRatings[season].episodes &&
      allUserRatings[season].episodes[episode_num]
    ) {
      let rating = null;
      let review = null;
      // check for rating and review
      if (allUserRatings[season].episodes[episode_num].rating) {
        rating = allUserRatings[season].episodes[episode_num].rating;
      }

      if (allUserRatings[season].episodes[episode_num].review) {
        review = allUserRatings[season].episodes[episode_num].review;
      }

      return { rating, review };
    }

    return null;
  };

  // compute modal state from search params
  const currentEpisode = searchParams.get("episode");
  const modalOpen = Boolean(currentEpisode);

  // open modal by updating URL params (no local modal state)
  const handleEpisodeClick = (episodeNum) => {
    const params = new URLSearchParams(searchParams);
    params.set("episode", episodeNum);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!seasonInfo) {
    return <div>Loading...</div>;
  }

  if (!seasonInfo.episodes || seasonInfo.episodes.length === 0) {
    return <div>No episodes available.</div>;
  }

  const currentSeason = searchParams.get("season");

  return (
    <section className="flex flex-col justify-center w-full items-center">
      <div className="average-season flex flex-col text-sm text-customGrey mt-4 items-center tracking-tight font-bold">
        {averageSeasonRating != null && (
          <>
            <p>{allUserInfo.viewedProfileUsername}&apos;s Season Rating:</p>
            <p className="text-2xl">
              <span className="text-4xl text-highlight">
                {typeof averageSeasonRating === "number"
                  ? averageSeasonRating.toFixed(1)
                  : averageSeasonRating}
              </span>
              /5
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col w-full max-w-3xl gap-4 p-4">
        <ul className="flex flex-col w-full gap-4">
          {seasonInfo.episodes.map((ep) => (
            <li key={ep.id ?? `${ep.season_number}.${ep.episode_number}`}>
              <IndividualEpisodes
                episode={ep}
                onClick={() => handleEpisodeClick(ep.episode_number)}
                season={ep.season_number}
                currentEpisode={ep.episode_number}
                ratingData={isEpisodeWatchedRating(
                  ep.season_number,
                  ep.episode_number
                )}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Season review form uses server action via formAction */}
      <div className="season-review mt-6 items-center justify-center w-full max-w-3xl">
        <form action={formAction} className="w-full">
          <p className="text-white text-center text-lg italic tracking-tight font-bold">
            Season Review
          </p>

          {/* names must match what submitSeasonRating expects */}
          <input
            type="hidden"
            name="average_season_rating"
            value={averageSeasonRating ?? ""}
          />
          <input type="hidden" name="showId" value={allShowInfo.showId ?? ""} />
          <input type="hidden" name="season" value={seasonNumber ?? ""} />

          <textarea
            id="season-rating-comment"
            name="season-rating-comment"
            rows="4"
            className="w-full mt-3 px-3 py-2 bg-[#0b1220] border border-white/5 rounded-md text-white"
            placeholder="Share your thoughts on this season..."
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isPending}
              className="mt-4 bg-highlight flex-1 rounded-lg cursor-pointer p-3 disabled:opacity-50 text-white tracking-tight font-bold"
            >
              {isPending ? "Submitting..." : "Submit season review"}
            </button>
          </div>
        </form>

        {/* optional: render server-side validation errors */}
        {state?.errors && (
          <div className="mt-3 text-sm text-red-400">
            {Object.values(state.errors).join(" • ")}
          </div>
        )}
        {state?.success && (
          <div className="mt-3 text-sm text-green-400">Season review saved.</div>
        )}
      </div>

      {/* ------- Render stored season review (safe access) ------- */}
      {validSeasonNumber != null &&
        allUserRatings &&
        allUserRatings[validSeasonNumber] &&
        allUserRatings[validSeasonNumber].season_review && (
          <div className="mt-6 w-full max-w-3xl bg-[#07101a] p-4 rounded-md border border-white/5">
            <p className="text-white font-semibold text-sm mb-2">
              Season review by {allUserInfo.viewedProfileUsername}:
            </p>
            <p className="text-sm text-gray-200">
              {allUserRatings[validSeasonNumber].season_review}
            </p>
          </div>
      )}
      {/* --------------------------------------------------------- */}

      {modalOpen && (
        <ModalContainer
          key={`modal-${currentSeason}-${currentEpisode}`}
          allUserInfo={allUserInfo}
          allShowInfo={allShowInfo}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.delete("episode");
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          }}
          currentSeason={currentSeason}
          currentEpisode={currentEpisode}
        />
      )}
    </section>
  );
}
