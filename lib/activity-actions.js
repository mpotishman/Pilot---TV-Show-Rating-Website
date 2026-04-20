import db from "./db";

export async function addActivity({
  user_id,
  type,
  show_id = null,
  show_name = null,
  season_number = null,
  episode_number = null,
  rating = null,
  review = null,
}) {
  const userId = parseInt(user_id, 10);

  if (!userId) throw new Error("Missing user_id");
  if (!type) throw new Error("Missing type");

  return db.prepare(
    `INSERT INTO activity (
      user_id, type, show_id, show_name,
      season_number, episode_number, rating, review, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    userId,
    type,
    show_id != null ? Number(show_id) : null,
    show_name ?? null,
    season_number != null ? Number(season_number) : null,
    episode_number != null ? Number(episode_number) : null,
    rating != null ? Number(rating) : null,
    review ?? null,
    Math.floor(Date.now() / 1000)
  );
}

export async function addWatchlistToActivity(user_id, type, show_id, show_name) {
  return addActivity({
    user_id,
    type,
    show_id,
    show_name,
  });
}
