import LogInModal from "./log-in-modal";
import React, { useEffect } from "react";
import EpisodeDescriptionSection from "./episode-desciption-section";
import RatingModal from "./rating-modal";

export default function ModalContainer({
  allUserInfo,
  allShowInfo,
  onClick,
  currentEpisode,
  currentSeason,
}) {
  const { isLoggedIn, viewing, canEdit, viewedProfileUsername } = allUserInfo;
  const { showInfo, episodeInfo } = allShowInfo;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  let innerContent;

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
  } else if (isLoggedIn && canEdit) {
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
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
          />
        </div>
      </>
    );
  } else if ((isLoggedIn && !canEdit) || (!isLoggedIn && viewing === true)) {
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
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
          />
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClick} />

      <div className="relative bg-[#161d29] rounded-lg p-6 w-128 z-10 animate-modalIn">
        {innerContent}
      </div>
    </div>
  );
}
