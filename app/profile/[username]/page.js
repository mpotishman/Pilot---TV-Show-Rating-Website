// app/profile/[[...profileId]]/page.js
import ProfileTabSection from "@/components/profile/profile-tab-section";
import ProfileTopSection from "@/components/profile/profile-top-section";
import { getCurrentUser } from "@/lib/auth";
import { getUserById, getUserByUsername } from "@/lib/user";
import React from "react";
import getWatchedShows from "@/lib/user";
import getShowById, { getEpisodeDetails } from "@/actions/actions";
import { getWatchedListedShows } from "@/lib/watchlist";
import { getRatingInformation } from "@/lib/ratings";
import { getTVDetails } from "@/actions/actions";
import { getSeasonDetails } from "@/actions/actions";

export default async function ProfilePage({ params, searchParams }) {
  // Await params first
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { username } = resolvedParams; // ← this is now a string, not an array
  const activeTab = resolvedSearchParams?.tab || "watched";

  // Don't index it - it's already the username
  const currentViewedProfile = username; // ← remove [0]

  console.log("Current viewed profile:", currentViewedProfile);

  const profileInfo = await getUserByUsername(currentViewedProfile);
  console.log("Profile Info = ", profileInfo);

  // get id of the current user
  const currentUserId = (await getCurrentUser()).user.id;

  // check to see if user is viewing their own page
  let canEdit = false;
  if (String(currentUserId) === String(profileInfo?.id)) {
    canEdit = true;
  }

  // WATCHED SHOWS SECTION
  // get all the shows the user has watched and all the information
  // first get the show Id's on shows watched by the user
  const showsWatched = await getWatchedShows([profileInfo.id]);
  const showIds = showsWatched.map((row) => row.show_id);
  console.log("Shows watched = ", showIds);

  // now loop through all the show Ids, and get information on all of them
  let showWatchedInformation = [];
  for (const id of showIds) {
    const showInformation = await getShowById(id);
    showWatchedInformation.push(showInformation);
  }

  console.log("watched shows = ", showWatchedInformation);

  // WATCHLISTED SHOW SECTION
  const watchlistedShows = await getWatchedListedShows([profileInfo.id]);
  const watchlistedshowIds = watchlistedShows.map((row) => row.show_id);

  // now loop through all the show Ids, and get information on all of them
  let watchlistedShowInformation = [];
  for (const id of watchlistedshowIds) {
    const showInformation = await getShowById(id);
    watchlistedShowInformation.push(showInformation);
  }

  console.log("watchliated shows = ", watchlistedShowInformation);

  console.log("active tab = ", activeTab);

  // RATING INFORMATION SECTION
  const userRatings = await getRatingInformation(profileInfo?.id);

  const enrichedRatings = await Promise.all(
    userRatings.map(async (rating) => {
      const showDetails = await getShowById(rating.show_id);
      if (rating.type === "episode") {
        const ep = await getEpisodeDetails(
          rating.show_id,
          rating.season_number,
          rating.episode_number
        );

        return {
          ...rating,
          still_path: ep?.still_path
            ? `https://image.tmdb.org/t/p/w780${ep.still_path}`
            : null,
          name: showDetails.name,
          episode_name: ep.name,
        };
      }

      if (rating.type === "season") {

        const season = await getSeasonDetails(
          rating.show_id,
          rating.season_number
        );

        return {
          ...rating,
          still_path: season?.poster_path
            ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
            : null,
          name: showDetails.name,
        };
      }

      return rating;
    })
  );

  console.log("user ratings = ", enrichedRatings);

  return (
    <>
      <ProfileTopSection
        profileInfo={profileInfo}
        currentViewedProfile={profileInfo?.id}
        canEdit={canEdit}
      />
      <ProfileTabSection
        activeTab={activeTab}
        watchedShows={showWatchedInformation}
        watchlistedShows={watchlistedShowInformation}
        ratingInformation={enrichedRatings}
      />
    </>
  );
}
