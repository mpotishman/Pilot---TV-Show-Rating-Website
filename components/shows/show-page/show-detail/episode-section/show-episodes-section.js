"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import SeasonEpisodesDisplay from "./season-episodes-display";
import SeasonButtons from "@/components/buttons/season-buttons";

export default function ShowEpisodesSection({
  activeInfo,
  allShowInfo,
  allUserInfo,
}) {
  // console.log("=== SHOW EPISODES SECTION ===");
  // console.log("seasonInfo received:", seasonInfo);
  // console.log("seasonInfo type:", typeof seasonInfo);

  const { activeSeason } = activeInfo;
  const { showId, seasons } = allShowInfo;

  const seasonCount = typeof seasons === "number" ? seasons : 0;
  const seasonArray = Array.from({ length: seasonCount }, (_, i) => i + 1);

  const router = useRouter();
  const pathname = usePathname();

  const handleSeasonClick = (seasonSelected) => {
    router.push(`${pathname}?tab=episodes&season=${seasonSelected}`, {
      scroll: true,
    });
  };

  // maybe later check for how many seasons, if over x, then remove flex wrap and make it scroll instead

  return (
    <section className="flex-row">
      <div className="pt-6">
        {seasonCount === 0 ? (
          <p>No seasons available.</p>
        ) : (
          <ul className="flex gap-4 justify-center flex-wrap">
            {seasonArray.map((seasonNum) => (
              <li key={`${showId}.season.${seasonNum}`} className="py-1">
                <SeasonButtons
                  onClick={() => handleSeasonClick(seasonNum)}
                  active={activeSeason === String(seasonNum)}
                >
                  Season {seasonNum}
                </SeasonButtons>
              </li>
            ))}
          </ul>
        )}
        <SeasonEpisodesDisplay
          allShowInfo={allShowInfo}
          allUserInfo={allUserInfo}
        />
      </div>
    </section>
  );
}
