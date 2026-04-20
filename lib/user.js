import db from "./db.js";

export function createUser(email, username, password) {
  const result = db
    .prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)")
    .run(email, username, password);

  const userId = result.lastInsertRowid;

  // Create empty stats row
  db.prepare(
    "INSERT INTO user_stats (user_id, hours_watched, shows_watched, episodes_watched) VALUES (?, 0, 0, 0)"
  ).run(userId);

  return userId;
}


export function getUserByEmail(email){
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function getUserByUsername(username) {
  return db.prepare(`
    SELECT 
      users.id,
      users.email,
      users.username,
      users.bio,

      user_stats.hours_watched,
      user_stats.shows_watched,
      user_stats.episodes_watched

    FROM users
    LEFT JOIN user_stats
      ON users.id = user_stats.user_id

    WHERE users.username = ?
  `).get(username);
}

export function getAuthUserByUsername(username) {
  return db
    .prepare(
      `SELECT id, email, username, password, bio
       FROM users
       WHERE username = ?`
    )
    .get(username);
}

export function getUserById(id) {
  return db.prepare(`
    SELECT 
      users.id,
      users.email,
      users.username,
      users.bio,

      user_stats.hours_watched,
      user_stats.shows_watched,
      user_stats.episodes_watched

    FROM users
    LEFT JOIN user_stats
      ON users.id = user_stats.user_id

    WHERE users.id = ?
  `).get(id);
}

export default async function getWatchedShows(user_id){
  return db.prepare(`SELECT DISTINCT show_id FROM episode_ratings WHERE user_id = ?`).all(user_id)
}
