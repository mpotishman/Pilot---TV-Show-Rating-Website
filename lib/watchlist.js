// lib/watchlist.js
import { addWatchlistToActivity } from "./activity-actions";
import db from "./db";

export async function insertWatchlistedShow(userId, showId, showName) {
  try {
    // Convert to integer
    const id = parseInt(userId, 10);

    const result = db
      .prepare(
        "INSERT INTO watchlist (user_id, show_id, added_at) VALUES (?, ?, ?)"
      )
      .run(id, showId, Math.floor(Date.now() / 1000)); // Unix timestamp in seconds

    console.log("Show added to watchlist, now adding to activity...");
    await addWatchlistToActivity(id, "added_watchlist", showId, showName);
    console.log("Activity record created successfully");

    return result;
  } catch (error) {
    console.error("Error in insertWatchlistedShow:", error);
    throw error;
  }
}

export async function removeWatchlistedShow(userId, showId) {
  const result = db
    .prepare("DELETE FROM watchlist WHERE user_id = ? AND show_id = ?")
    .run(userId, showId);
  return result;
}

export async function checkIfOnWatchlist(userId, showId) {
  const result = db
    .prepare(
      "SELECT COUNT(*) as count FROM watchlist WHERE user_id = ? AND show_id = ?"
    )
    .get(userId, showId);
  return result.count > 0;
}

export async function getWatchedListedShows(user_id) {
  return db
    .prepare(`SELECT DISTINCT show_id FROM watchlist WHERE user_id = ?`)
    .all(user_id);
}
