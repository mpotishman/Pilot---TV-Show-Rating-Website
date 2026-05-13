import sql from "better-sqlite3";

const db = sql("pilot.db");
db.pragma("foreign_keys = ON");

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  bio TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
)`);

db.exec(`
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON users(username);
`);

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);


db.exec(`
CREATE TABLE IF NOT EXISTS user_stats (
  user_id INTEGER PRIMARY KEY,
  hours_watched REAL DEFAULT 0,
  shows_watched INTEGER DEFAULT 0,
  episodes_watched INTEGER DEFAULT 0,
  updated_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS episode_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,          -- TMDB show ID
  season_number INTEGER NOT NULL,
  episode_number INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 0 AND rating <= 5),
  review TEXT,
  watched_at INTEGER DEFAULT (strftime('%s','now')),
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, show_id, season_number, episode_number)
);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON episode_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_show ON episode_ratings(show_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_show ON episode_ratings(user_id, show_id);
`);

db.exec(`CREATE TABLE IF NOT EXISTS season_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,
  season_number INTEGER NOT NULL,
  season_review TEXT,
  average_rating REAL CHECK(average_rating >= 0 AND average_rating <= 5),
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, show_id, season_number)
);`)

db.exec(`
CREATE UNIQUE INDEX IF NOT EXISTS idx_season_ratings_user_show_season
ON season_ratings(user_id, show_id, season_number);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS show_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,          -- TMDB show ID
  current_season INTEGER DEFAULT 1,
  current_episode INTEGER DEFAULT 1,
  last_watched INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, show_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_user ON show_progress(user_id);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS watchlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,          -- TMDB show ID
  added_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, show_id)
);
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
`);

db.exec(`CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  show_id INTEGER,
  show_name TEXT,
  season_number INTEGER,
  episode_number INTEGER,
  rating INTEGER,
  review TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`);


export default db;
