// lib/ratings.js
import db from "./db.js";

// Insert or update a rating
// Added optional episodeDurationMinutes (number) — minutes of runtime for the episode
export async function insertRating(
  user_id,
  show_id,
  season_number,
  episode_number,
  rating,
  review,
  episodeDurationMinutes = null
) {
  // 1) Check whether this exact episode already exists for this user (pre-upsert)
  const existingEpisode = db
    .prepare(
      `SELECT id FROM episode_ratings
       WHERE user_id = ? AND show_id = ? AND season_number = ? AND episode_number = ?
       LIMIT 1`
    )
    .get(user_id, show_id, season_number, episode_number);

  const isUpdate = !!existingEpisode; // true => editing an existing rating; false => new insert

  // 2) Check whether the user already has ANY episode for this show (before this upsert).
  //    If they have none, then inserting this episode will be the FIRST episode for that show.
  const showCountRow = db
    .prepare(
      `SELECT COUNT(1) AS cnt FROM episode_ratings
       WHERE user_id = ? AND show_id = ?`
    )
    .get(user_id, show_id);
  const hadAnyEpisodeForShow = showCountRow && showCountRow.cnt > 0;

  // Wrap in a transaction so we don't leave counters inconsistent on error
  try {
    db.prepare("BEGIN").run();

    // Perform upsert (insert or update). Keep your original ON CONFLICT behaviour.
    const result = db
      .prepare(
        `INSERT INTO episode_ratings
          (user_id, show_id, season_number, episode_number, rating, review, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, strftime('%s','now'))
         ON CONFLICT(user_id, show_id, season_number, episode_number)
         DO UPDATE SET
           rating = excluded.rating,
           review = excluded.review,
           updated_at = strftime('%s','now')`
      )
      .run(user_id, show_id, season_number, episode_number, rating, review);

    // If this was a NEW insert (not an edit), update counters:
    if (!isUpdate) {
      //  - episodes_watched +1
      //  - shows_watched +1 only if user had no episodes for this show previously
      //  - hours_watched add (episodeDurationMinutes / 60) if duration provided
      const epIncrement = 1;
      const showIncrement = hadAnyEpisodeForShow ? 0 : 1;

      if (
        episodeDurationMinutes != null &&
        !Number.isNaN(Number(episodeDurationMinutes))
      ) {
        // treat hours_watched as hours (float). If your column stores minutes, change this math.
        const hoursToAdd = Number(episodeDurationMinutes) / 60;

        db.prepare(
          `UPDATE user_stats
           SET
             episodes_watched = COALESCE(episodes_watched, 0) + ?,
             shows_watched = COALESCE(shows_watched, 0) + ?,
             hours_watched = COALESCE(hours_watched, 0) + ?
           WHERE user_id = ?`
        ).run(epIncrement, showIncrement, hoursToAdd, user_id);
      } else {
        // no duration provided — update only counts
        db.prepare(
          `UPDATE user_stats
           SET
             episodes_watched = COALESCE(episodes_watched, 0) + ?,
             shows_watched = COALESCE(shows_watched, 0) + ?
           WHERE user_id = ?`
        ).run(epIncrement, showIncrement, user_id);
      }
    } else {
      // optional: if you want edits to change hours_watched when user changes duration / rating, you'd compute deltas here
      // For now we do nothing for edits.
    }

    db.prepare("COMMIT").run();
    return result;
  } catch (err) {
    // rollback on error
    try {
      db.prepare("ROLLBACK").run();
    } catch (e) {
      console.error("Rollback failed:", e);
    }
    throw err;
  }
}

// submit season rating
export async function insertSeasonRating(
  user_id,
  show_id,
  season_number,
  average_rating,
  season_review
) {
  return db
    .prepare(
      `INSERT INTO season_ratings (user_id, show_id, season_number, average_rating, season_review) VALUES (?,?,?,?,?)`
    )
    .run(user_id, show_id, season_number, average_rating, season_review);
}

// Get single rating
export async function getRating(
  user_id,
  show_id,
  season_number,
  episode_number
) {
  return db
    .prepare(
      `SELECT id, user_id, show_id, season_number, episode_number, rating, review, created_at, updated_at
       FROM episode_ratings
       WHERE user_id = ? AND show_id = ? AND season_number = ? AND episode_number = ?
       LIMIT 1`
    )
    .get(user_id, show_id, season_number, episode_number);
}

// NEW: Get ALL ratings for a user on a specific show
export async function getAllShowRatings(user_id, show_id) {
  const ratings = db
    .prepare(
      `SELECT season_number, episode_number, rating, review, created_at, updated_at
       FROM episode_ratings
       WHERE user_id = ? AND show_id = ?
       ORDER BY season_number ASC, episode_number ASC`
    )
    .all(user_id, show_id);

  // Also get season-level metadata (average + review) from season_ratings
  const seasonMetaRows = db
    .prepare(
      `SELECT season_number, average_rating, season_review, created_at, updated_at
     FROM season_ratings
     WHERE user_id = ? AND show_id = ?`
    )
    .all(user_id, show_id);

  // Build a quick map of season metadata by season_number for fast lookup
  const seasonMetaMap = {};
  if (Array.isArray(seasonMetaRows)) {
    seasonMetaRows.forEach((r) => {
      // store by numeric key to match how structured is indexed
      seasonMetaMap[r.season_number] = {
        average: r.average_rating != null ? Number(r.average_rating) : null,
        season_review: r.season_review ?? null,
        created_at: r.created_at ?? null,
        updated_at: r.updated_at ?? null,
      };
    });
  }

  // Transform into nested structure: { 1: { episodes: { 1: { rating: 5, review: "..." } }, average, season_review } }
  const structured = {};

  // Populate episodes
  ratings.forEach((row) => {
    const {
      season_number,
      episode_number,
      rating,
      review,
      created_at,
      updated_at,
    } = row;

    if (!structured[season_number]) {
      structured[season_number] = { episodes: {} }; // Make sure episodes object exists
    }

    structured[season_number].episodes[episode_number] = {
      rating,
      review,
      created_at,
      updated_at,
    };
  });

  // Calculate season averages (from episode ratings) and attach season metadata (review / stored average)
  for (const season in structured) {
    const episodes = structured[season].episodes;
    const ratingsArray = Object.values(episodes)
      .map((ep) => Number(ep.rating))
      .filter((r) => Number.isFinite(r));
    const sum = ratingsArray.reduce((a, b) => a + b, 0);
    const computedAverage = ratingsArray.length
      ? sum / ratingsArray.length
      : null;

    // attach computed average by default
    structured[season].average = computedAverage;

    // if we have season metadata from season_ratings, attach review and (optionally) prefer stored average
    const meta = seasonMetaMap[Number(season)];
    if (meta) {
      // attach season review (nullable)
      structured[season].season_review = meta.season_review ?? null;

      // prefer stored average if present (otherwise keep computed)
      if (meta.average != null && Number.isFinite(meta.average)) {
        structured[season].average = meta.average;
      }

      // also attach metadata timestamps if desired
      structured[season].season_created_at = meta.created_at;
      structured[season].season_updated_at = meta.updated_at;
    } else {
      // ensure keys exist even if no meta row
      structured[season].season_review = null;
      structured[season].season_created_at = null;
      structured[season].season_updated_at = null;
    }
  }

  return structured;
}

export async function getRatingInformation(user_id) {
  // 1. Fetch all ratings
  const episodeRatings = db.prepare(`
    SELECT *, created_at 
    FROM episode_ratings 
    WHERE user_id = ?
  `).all(user_id)

  const seasonRatings = db.prepare(`
    SELECT *, created_at 
    FROM season_ratings 
    WHERE user_id = ?
  `).all(user_id)

  // const showRatings = db.prepare(`
  //   SELECT *, created_at 
  //   FROM show_ratings 
  //   WHERE user_id = ?
  // `).all(user_id)


  // 2. Normalise + attach type
  const normalizedEpisodes = episodeRatings.map(r => ({
    type: "episode",
    ...r
  }))

  const normalizedSeasons = seasonRatings.map(r => ({
    type: "season",
    ...r
  }))

  // const normalizedShows = showRatings.map(r => ({
  //   type: "show",
  //   ...r
  // }))


  // 3. Combine them into a single flat array
  const combined = [
    ...normalizedEpisodes,
    ...normalizedSeasons,
    // ...normalizedShows,
  ]


  // 4. Sort by timestamp newest → oldest
  combined.sort((a, b) => {
    const dateA = Number(a.created_at)
    const dateB = Number(b.created_at)
    return dateB - dateA
  })


  // 5. Return a single unified list
  return combined
}
