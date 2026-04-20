"use client";

import React, { useEffect } from "react";
import { useActionState } from "react";
import { submitRating } from "@/actions/rating-actions";

export default function RatingModal({
  allUserInfo,
  showInfo,
  episodeInfo,
  type,
  onClick,
  currentSeason,
  currentEpisode,
}) {
  const [state, formAction, isPending] = useActionState(submitRating, {});

  const {
    canEdit,
    viewedUserRatingInfo,
    currentUserRatingInfo,
    viewedProfileUsername,
  } = allUserInfo || {};

  // --- Minimal guard: require explicit selection OR episodeInfo
  // This prevents the modal mounting with stale values when parent opens it
  // before URL/searchParams are updated.
  const hasExplicitSelection =
    currentSeason !== undefined &&
    currentSeason !== null &&
    currentEpisode !== undefined &&
    currentEpisode !== null;

  // When server action signals success: close modal, then perform a full reload.
  useEffect(() => {
    if (state?.success) {
      try {
        // Close modal immediately (parent handler should unmount modal)
        onClick && onClick();
      } catch (err) {
        console.error("Error calling onClick to close modal:", err);
      }
    }
    // Only react when success changes
  }, [state?.success, onClick]);

  if (!hasExplicitSelection && !episodeInfo) {
    // don't render if we don't have a reliable season+episode yet
    return null;
  }

  // Use current params to get correct rating data (prefer explicit props)
  const season = Number.isFinite(Number(currentSeason))
    ? Number(currentSeason)
    : Number(episodeInfo?.season_number);
  const episode = Number.isFinite(Number(currentEpisode))
    ? Number(currentEpisode)
    : Number(episodeInfo?.episode_number);

  const allShowRatings = allUserInfo?.allShowRatings;

  let ratingToShow = undefined;
  let reviewToShow = "";

  // Defensive key handling: keys may be strings
  const seasonKey = season != null ? String(season) : null;
  const episodeKey = episode != null ? String(episode) : null;

  const seasonObj =
    (seasonKey &&
      (allShowRatings?.[seasonKey] ?? allShowRatings?.[Number(seasonKey)])) ||
    null;

  const episodeObj =
    seasonObj?.episodes && episodeKey
      ? seasonObj.episodes[episodeKey] ?? seasonObj.episodes[Number(episodeKey)]
      : null;

  if (episodeObj && episodeObj.rating != null) {
    const parsed = Number(episodeObj.rating);
    if (Number.isFinite(parsed)) {
      ratingToShow = parsed;
      reviewToShow = episodeObj.review ?? "";
    }
  }

  let editing = ratingToShow !== undefined && !Number.isNaN(ratingToShow);

  // RATING FORM
  if (type === "rating") {
    return (
      <form action={formAction} className="mt-6 w-full">
        <input type="hidden" name="showId" value={showInfo?.id ?? ""} />
        <input type="hidden" name="season" value={season ?? ""} />
        <input type="hidden" name="episode" value={episode ?? ""} />
        <input
          type="hidden"
          name="username"
          value={allUserInfo?.viewedProfileUsername ?? ""}
        />

        <div className="flex flex-col">
          <div className="rating mt-6">
            {editing && <p className="text-white text-lg ">Edit Rating</p>}
            {!editing && <p className="text-white text-lg ">Your Rating</p>}
          </div>

          <div className="flex flex-row-reverse items-center justify-center gap-2">
            {[5, 4, 3, 2, 1].map((n) => (
              <React.Fragment key={n}>
                <input
                  id={`star${n}`}
                  className="hidden peer/star"
                  type="radio"
                  name="rating"
                  value={n}
                  defaultChecked={ratingToShow === n}
                />
                <label
                  htmlFor={`star${n}`}
                  className="text-4xl cursor-pointer text-gray-400 peer-checked/star:text-highlight transition-colors"
                >
                  ★
                </label>
              </React.Fragment>
            ))}
          </div>

          {state?.errors?.rating && (
            <p className="text-red-400 text-sm mt-2">{state.errors.rating}</p>
          )}

          <div className="mt-4">
            {editing && (
              <label htmlFor="rating-comment" className="text-white text-lg">
                Edit Review
              </label>
            )}
            {!editing && (
              <label htmlFor="rating-comment" className="text-white text-lg">
                Your Review (Optional)
              </label>
            )}

            <textarea
              id="rating-comment"
              name="review"
              rows="4"
              className="w-full mt-3 px-3 py-2 bg-[#0b1220] border border-white/5 rounded-md text-white"
              placeholder="Share your thoughts on this episode..."
              defaultValue={reviewToShow}
            />
          </div>

          {state?.errors?.review && (
            <p className="text-red-400 text-sm mt-2">{state.errors.review}</p>
          )}

          {state?.errors?.general && (
            <p className="text-red-400 text-sm mt-2">{state.errors.general}</p>
          )}

          {state?.success && (
            <p className="text-green-400 text-sm mt-2">
              Rating submitted! Closing...
            </p>
          )}

          <div className="flex gap-4 mt-4">
            <button
              onClick={onClick}
              type="button"
              className="bg-sectionBackground p-3 w-[30%] rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-highlight flex-1 rounded-lg cursor-pointer p-3 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </div>
      </form>
    );
  }

  // VIEWING MODE (readonly)
  return (
    <form className="mt-6 w-full">
      <div className="flex flex-col">
        <div className="rating mt-6">
          <p className="text-white text-lg ">
            {viewedProfileUsername}&apos;s Rating
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-row-reverse items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <React.Fragment key={n}>
                <input
                  id={`star-view-${n}`}
                  className="hidden peer/star"
                  type="radio"
                  name="rating"
                  value={n}
                  disabled
                  checked={ratingToShow === n}
                  readOnly
                />
                <label
                  htmlFor={`star-view-${n}`}
                  className={`text-4xl ${
                    n <= ratingToShow ? "text-highlight" : "text-gray-400"
                  }`}
                >
                  ★
                </label>
              </React.Fragment>
            ))}
          </div>
          {currentUserRatingInfo?.rating && (
            <div className="text-sm italic text-customGrey tracking-tight font-bold mt-2">
              Your Rating: {currentUserRatingInfo?.rating} stars
            </div>
          )}
        </div>

        {reviewToShow && (
          <div className="mt-4">
            <label htmlFor="rating-comment-view" className="text-white text-lg">
              {viewedProfileUsername}&apos;s Review
            </label>
            <div className="cursor-not-allowed mt-4 rounded-lg border-white p-4 tracking-tight font-bold text-white bg-sectionBackground">
              {reviewToShow}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
