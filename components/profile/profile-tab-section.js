import React from "react";
import ProfileWatchedSection from "./profile-watched-section/profile-watched-section";
import ProfileWatchlistSection from "./profile-watchlist-section/profile-watchlist-section";
import ProfileRatingSection from "./profile-rating-section/profile-rating-section";

export default function ProfileTabSection({ activeTab, watchedShows, watchlistedShows, ratingInformation }) {
  let content;

  switch (activeTab){
    case 'watched':
      return <ProfileWatchedSection watchedShows={watchedShows}/>
    case 'watchlist':
      return <ProfileWatchlistSection watchlistedShows={watchlistedShows}/>
    case 'ratings':
      return <ProfileRatingSection ratingInformation={ratingInformation}/>
    default:
      return <ProfileWatchedSection watchedShows={watchedShows} />
  } 
}
