import sql from 'better-sqlite3';

const db = sql('pilot.db');

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  username TEXT,
  password TEXT,
  bio TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
)`);

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);


// profile_stats table (one row per user)
db.exec(`
CREATE TABLE IF NOT EXISTS user_stats (
  user_id INTEGER PRIMARY KEY,
  hours_watched INTEGER DEFAULT 0,
  shows_watched INTEGER DEFAULT 0,
  episodes_watched INTEGER DEFAULT 0,
  updated_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

// User ratings for episodes, remember to update in ratings.js later updated at section
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

// user ratings for seasons
db.exec(`CREATE TABLE IF NOT EXISTS season_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,
  season_number INTEGER NOT NULL,
  season_review TEXT,
  average_rating REAL CHECK(average_rating >= 0 AND average_rating <= 5),
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);`)

// User's show progress (what episode they're on)
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

// User's watchlist
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

// In your db initialization
db.exec(`DROP TABLE IF EXISTS activity;`);
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