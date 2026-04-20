import { getCurrentUser } from "@/lib/auth";
import LogInModal from "./log-in-modal";
import Image from "next/image";
import React from "react";
import EpisodeDescriptionSection from "./episode-desciption-section";
import RatingModal from "./rating-modal";
import { useEffect } from "react";

// Object
// air_date
// :
// "2016-07-15"
// crew
// :
// (5) [{…}, {…}, {…}, {…}, {…}]
// episode_number
// :
// 1
// episode_type
// :
// "standard"
// guest_stars
// :
// (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// id
// :
// 1198665
// name
// :
// "Chapter One: The Vanishing of Will Byers"
// overview
// :
// "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab."
// production_code
// :
// "0"
// runtime
// :
// 48
// season_number
// :
// 1
// still_path
// :
// "/uLES7sRpy7Ih6Kr6XCaYj1GyfTw.jpg"
// vote_average
// :
// 8.506
// vote_count
// :
// 1634
// [[Prototype]]
// :
// Object

export default function ModalContainer({
  allUserInfo,
  allShowInfo,
  onClick,
  currentEpisode,
  currentSeason,
}) {
  // destructure
  const { isLoggedIn, viewing, canEdit, viewedProfileUsername } = allUserInfo;
  const { showInfo, episodeInfo } = allShowInfo;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  let innerContent;

  // ==========================================================
  // CASE 1 — NOT LOGGED IN + NOT VIEWING + ON SHOW PAGE (Login required)
  // ==========================================================
  if (!isLoggedIn && viewing === false) {
    innerContent = (
      <>
        <div className="top-section flex justify-between">
          <div className="sign-in-required text-3xl tracking-tight font-bold">
            Sign in required
          </div>
          <button onClick={onClick}>X</button>
        </div>

        <hr className="text-customGrey mt-4" />

        <div className="must-be-logged-in flex flex-col items-center justify-center font-bold tracking-tight">
          <p className="text-6xl mt-6">🔒</p>
          <p className="text-2xl mt-6">You need to be logged in</p>
          <p className="text-sm text-customGrey mt-6">
            Create an account or sign in to rate your episodes and track your
            shows
          </p>
        </div>

        <LogInModal />
      </>
    );
  }

  // ==========================================================
  // CASE 2 — LOGGED IN + CAN EDIT (Your own rating)
  // ==========================================================
  else if (isLoggedIn && canEdit) {
    innerContent = (
      <>
        <div className="full-section flex flex-col gap-4">
          <EpisodeDescriptionSection
            episodeInfo={episodeInfo}
            onClick={onClick}
          />

          <RatingModal
            allUserInfo={allUserInfo}
            showInfo={showInfo}
            episodeInfo={episodeInfo}
            onClick={onClick}
            type={"rating"}
          />
        </div>
      </>
    );
  }

  // ==========================================================
  // CASE 3 — VIEWING ANOTHER USER'S RATING - (isLoggedIn && !canEdit) || (!isLoggedIn && viewing === true)

  // ==========================================================
  else if ((isLoggedIn && !canEdit) || (!isLoggedIn && viewing === true)) {
    innerContent = (
      <>
        <div className="full-section flex flex-col gap-4">
          <EpisodeDescriptionSection
            episodeInfo={episodeInfo}
            onClick={onClick}
          />

          <RatingModal
            allUserInfo={allUserInfo}
            showInfo={showInfo}
            episodeInfo={episodeInfo}
            viewedProfileUsername={viewedProfileUsername}
            onClick={onClick}
            type={"viewing"}
          />
        </div>
      </>
    );
  }

  // ==========================================================
  // MAIN WRAPPER FOR ALL CASES
  // ==========================================================
  const mainContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClick} />

      <div className="relative bg-[#161d29] rounded-lg p-6 w-128 z-10 animate-modalIn">
        {innerContent}
      </div>
    </div>
  );

  return mainContent;
}
