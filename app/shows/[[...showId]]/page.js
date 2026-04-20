// app/shows/[showId]/page.js
import React from "react";
import ShowContent from "@/components/show-content/show-content";
import {
  getSeasonDetails,
  getTVDetails,
  getEpisodeDetails,
  getCastDetails,
  getSimilarshows,
} from "@/actions/actions";
import { getCurrentUser, verifyAuth } from "@/lib/auth";

export default async function ShowPage({ params, searchParams }) {
  try {
    // get the active states - active tab, active season, active episode
    const resolvedSearchParams = await searchParams;
    const activeTab = resolvedSearchParams?.tab || "episodes";
    const activeSeason = resolvedSearchParams?.season || "1";
    const activeEpisode = resolvedSearchParams?.episode || "1";

    // get data about the show - showId, showInfo, seasons, seasonInfo, episodeInfo, castInfo, similarInfo
    const { showId } = await params;
    const showInfo = await getTVDetails(showId);
    const seasons = showInfo.number_of_seasons;
    const seasonInfo =
      activeTab === "episodes"
        ? await getSeasonDetails(showId, activeSeason)
        : null;
    const episodeInfo = await getEpisodeDetails(
      showId,
      activeSeason,
      activeEpisode
    );
    const castInfo = activeTab === "cast" ? await getCastDetails(showId) : null;
    const similarInfo =
      activeTab === "similar" ? await getSimilarshows(showId) : null;

    // get information about the current USER, NOT the user whos rating we are seeing - this page is when a non logged in user is not viewing, so barely any information is passed down here
    
    // console.log('pROFILEID = ', profileId);
    // let profileUsername;
    // if (profileId) {
    //   profileUsername = profileId.user.username
    // } else {
    //   profileUsername = null;
    // }
    
    // need to get currentUserId, and viewedProfileId, here we can set viewedProfileId to null since this route would never have a username

    const currentUser = null; // returns session info and user info - not logged in so null
    const viewedProfile = null;
    const result = await verifyAuth();
    const isLoggedIn = !!result.user; // true or false depending on if the user is logged in
    let canEdit = false;
    let viewing = false;
    let onShowPage;

    // now break all above definitions into 3 parts, activeInfo, allShowInfo, allUserInfo
    const activeInfo = {
      activeTab,
      activeSeason,
      activeEpisode,
    };

    const allShowInfo = {
      showId,
      showInfo,
      seasons,
      seasonInfo,
      episodeInfo,
      castInfo,
      similarInfo
    };

    const allUserInfo = {
      currentUser,
      viewedProfile,
      result,
      isLoggedIn,
      canEdit,
      viewing,

    }

    return (
      <ShowContent
        activeInfo={activeInfo}
        allShowInfo={allShowInfo}
        allUserInfo={allUserInfo}
      />
    );
  } catch (error) {
    console.error("ERROR IN SHOWPAGE:", error);
    return <div>Error loading show: {error.message}</div>;
  }
}
