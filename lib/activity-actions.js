// lib/activity-actions.js
import db from "./db";

export async function addWatchlistToActivity(
  user_id,
  type,
  show_id,
  show_name
) {
  try {
    // Convert user_id to integer
    const userId = parseInt(user_id, 10);

    console.log("addWatchlistToActivity called with:", {
      userId,
      type,
      show_id,
      show_name,
    });

    // Sanity checks before DB call
    if (!userId) {
      console.error("addWatchlistToActivity: missing user_id");
      throw new Error("Missing user_id");
    }
    if (!type) {
      console.error("addWatchlistToActivity: missing type");
      throw new Error("Missing type");
    }
    if (!show_id) {
      console.error("addWatchlistToActivity: missing show_id");
      throw new Error("Missing show_id");
    }

    const createdAt = Math.floor(Date.now() / 1000);

    const stmt = db.prepare(
      `INSERT INTO activity (
         user_id, type, show_id, show_name,
         season_number, episode_number, rating, review, created_at
       ) VALUES (?,?,?,?,?,?,?,?,?)`
    );

    const result = stmt.run(
      userId,
      type,
      show_id,
      show_name ?? null,
      null,
      null,
      null,
      null,
      createdAt
    );

    console.log("addWatchlistToActivity - run result:", result);

    if (typeof result.changes !== "undefined") {
      if (result.changes === 0) {
        console.warn(
          "addWatchlistToActivity: INSERT ran but changes === 0 (no row added)"
        );
      } else {
        console.log(
          "addWatchlistToActivity: row inserted, lastInsertRowid =",
          result.lastInsertRowid
        );
      }
    } else {
      console.warn(
        "addWatchlistToActivity: result.changes is undefined, result:",
        result
      );
    }

    return result;
  } catch (error) {
    console.error("Error adding to activity:", error);
    throw error;
  }
}
