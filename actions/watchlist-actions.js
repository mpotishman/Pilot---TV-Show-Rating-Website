// app/actions/watchlist-actions.js
"use server";

import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { insertWatchlistedShow, removeWatchlistedShow } from "@/lib/watchlist";
import { addWatchlistToActivity } from "@/lib/activity-actions";

export default async function addShowToWatchlist(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.user?.id) {
    return { errors: { auth: "You must be logged in to add to watchlist" } };
  }

  const userId = currentUser.user.id;
  const showId = formData.get("showId");
  const username = formData.get("username");
  const alreadyInWatchlist = formData.get("already-watchlisted");
  const showName = formData.get("show_name");

  // validation
  let errors = {};

  if (!showId) {
    errors.showId = "No show selected - show does not have valid ID";
  }

  if (!userId) {
    errors.userId = "User must be logged in to watchlist a show";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // if alreadyInWatchlist is truthy, then we remove it from the database
  if (alreadyInWatchlist) {
    try {
      await removeWatchlistedShow(userId, showId);
      revalidatePath(`/${username}/shows/${showId}`);
      return { success: true, added: false };
    } catch (error) {
      return {
        errors: {
          general:
            "Failed to remove show from watchlist. Please try again later.",
        },
      };
    }
  } else {
    try {
      console.log("Adding to watchlist...");
      await insertWatchlistedShow(userId, showId, showName);
      console.log("Inserted to watchlist table");

      // console.log("Adding to activity with:", { userId, showId, showName });
      // await addWatchlistToActivity(userId, "added_watchlist", showId, showName);
      // console.log("Added to activity table");

      revalidatePath(`/${username}/shows/${showId}`);
      return { success: true, added: true };
    } catch (error) {
      console.error("Error in watchlist action:", error);
      return {
        errors: {
          general: "Failed to add show to watchlist. Please try again later.",
        },
      };
    }
  }
}
