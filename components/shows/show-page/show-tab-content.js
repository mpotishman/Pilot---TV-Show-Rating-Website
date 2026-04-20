// ShowTabContent.js
"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import ShowEpisodesSection from "@/components/shows/show-page/show-detail/episode-section/show-episodes-section";
import ShowOverviewSection from "@/components/shows/show-page/show-detail/overview-section/show-overview-section";
import ShowCastSection from "@/components/shows/show-page/show-detail/cast-section/show-cast-section";
import ShowSimilarSection from "@/components/shows/show-page/show-detail/similar-section/show-similar-section";

export default function ShowTabContent({
  activeInfo,
  allShowInfo,
  allUserInfo,
}) {
  // console.log("=== SHOW TAB CONTENT ===");
  // console.log("activeTab:", activeTab);
  // console.log("seasonInfo received:", seasonInfo);
  // console.log("seasonInfo type:", typeof seasonInfo);

  // destructure the active tab
  const { activeTab } = activeInfo;

  // destructure the allShowInfo to get only that which is used
  const {
    showId,
    showInfo,
    castInfo,
    similarInfo,
  } = allShowInfo;

  const {viewedProfileUsername} = allUserInfo;


  switch (activeTab) {
    case "overview":
      return <ShowOverviewSection showInfo={showInfo} />;
    case "cast":
      return (
        <ShowCastSection
          showInfo={showInfo}
          castInfo={castInfo}
        />
      );
    case "similar":
      return <ShowSimilarSection showId={showId} similarInfo={similarInfo} />;
    case "episodes":
    default:
      return (
        <>
  
        <ShowEpisodesSection
          activeInfo={activeInfo}
          allShowInfo = {allShowInfo}
          allUserInfo={allUserInfo}
        />
        </>
      );
  }
}
