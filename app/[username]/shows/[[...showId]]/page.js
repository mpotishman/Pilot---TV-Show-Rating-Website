import React from "react";
import ShowContent from "@/components/show-content/show-content";
import {
  getSeasonDetails,
  getTVDetails,
  getEpisodeDetails,
  getCastDetails,
  getSimilarshows,
} from "@/actions/actions";
import { getCurrentUser } from "@/lib/auth";
import { getUserByUsername } from "@/lib/user";
import { getRating, getAllShowRatings } from "@/lib/ratings";
import { checkIfOnWatchlist } from "@/lib/watchlist";

// this is the page the user sees when they are a) logged in or b) looking at a users ratings
export default async function UserShowPage({ params, searchParams }) {
  try {
    // get the active states - active tab, active season, active episode
    const resolvedSearchParams = await searchParams;
    const activeTab = resolvedSearchParams?.tab || "episodes";
    const activeSeason = resolvedSearchParams?.season || "1";
    const activeEpisode = resolvedSearchParams?.episode || "1";

    // get data about the show - showId, showInfo, seasons, seasonInfo, episodeInfo, castInfo, similarInfo
    const { username, showId } = await params;
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

    // get the current user that is logged in, and get their username and id
    const currentUser = await getCurrentUser(); // returns session info and user info

    // get ID of currently logged in user
    let currentUserId = null;
    if (currentUser && currentUser.user && currentUser.user.id) {
      currentUserId = currentUser.user.id;
    }

    // get Username of currently logged in user
    let currentUserUsername = null;
    if (currentUser && currentUser.user && currentUser.user.username) {
      currentUserUsername = currentUser.user.username;
    }

    // check if someone is logged in
    let isLoggedIn = false;
    if (currentUser && currentUser.user) {
      isLoggedIn = true;
    }

    const viewedProfile = await getUserByUsername(username);

    // if no username, show an error
    if (!viewedProfile) {
      return <div>User not found</div>;
    }

    // get ID of currently viewed user
    let viewedProfileId = null;
    if (viewedProfile && viewedProfile.id) {
      viewedProfileId = viewedProfile.id;
    }

    let viewedProfileUsername = null;
    if (viewedProfile && viewedProfile.username) {
      viewedProfileUsername = viewedProfile.username;
    }

    // now check if the currently logged in user can edit the page
    let canEdit = false;
    if (
      isLoggedIn &&
      currentUserId &&
      viewedProfileId &&
      currentUserId === viewedProfileId
    ) {
      canEdit = true;
    }

    // get the rating of the vieweduser on the episode selected, if viewed user is current user still just gets their rating
    let viewedUserRatingInfo = null;
    if (viewedProfileId) {
      viewedUserRatingInfo = await getRating(
        viewedProfileId,
        showId,
        parseInt(activeSeason, 10),
        parseInt(activeEpisode, 10)
      );
    }

    // get the rating of the current user, always show viewed user as its the same if current user = viewed user but if not show a comparison
    let currentUserRatingInfo = null;
    if (currentUserId) {
      currentUserRatingInfo = await getRating(
        currentUserId,
        showId,
        parseInt(activeSeason, 10),
        parseInt(activeEpisode, 10)
      );
    }

    const allShowRatings = viewedProfileId
      ? await getAllShowRatings(viewedProfileId, showId)
      : {};

    // check if for the current user if the show is on the watchlist or not
    const initialWatchlistStatus = currentUserId
      ? await checkIfOnWatchlist(currentUserId, showId)
      : false;

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
      similarInfo,
    };

    const allUserInfo = {
      currentUserId,
      currentUserUsername,
      viewedProfileId,
      viewedProfileUsername,
      isLoggedIn,
      canEdit,
      viewing: true,
      viewedUserRatingInfo,
      currentUserRatingInfo,
      allShowRatings,
      initialWatchlistStatus,
    };

    return (
      <>
    
        <ShowContent
          activeInfo={activeInfo}
          allShowInfo={allShowInfo}
          allUserInfo={allUserInfo}
        />
      </>
    );
  } catch (error) {
    console.error("ERROR IN SHOWPAGE:", error);
    return <div>Error loading show: {error.message}</div>;
  }
}
