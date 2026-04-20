// components/show-content/show-content.js
import ShowTopSection from "@/components/shows/show-page/show-top-section";
import ShowTabContent from "@/components/shows/show-page/show-tab-content";
import FocusLogger from "@/components/debug/focus-logger.client";

export default function ShowContent({
  activeInfo,
  allShowInfo,
  allUserInfo
}) {

  const {showId, showInfo} = allShowInfo;
  const {isLoggedIn, viewedProfileUsername} = allUserInfo;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#0a0e17] to-[#1a1f2e]">

      {/* Centered content box with side borders */}
      <div className="max-w-7xl mx-auto border-l border-r border-[#283042]/40">

        <div className="w-full flex flex-col items-center">
          <ShowTopSection
            show={showInfo}
            showId={showId}
            isLoggedIn={isLoggedIn}
            allUserInfo={allUserInfo}
          />
        </div>

        <div className="w-full px-4 py-8">
 
          <ShowTabContent
            activeInfo={activeInfo}
            allShowInfo={allShowInfo}
            allUserInfo={allUserInfo}
          />
        </div>

      </div>

    </div>
  );
}
