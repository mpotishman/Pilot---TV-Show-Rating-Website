# Pilot

Pilot is a TV tracking app built with Next.js, SQLite, and Lucia Auth.

## Features

- Browse trending and popular TV shows from TMDB
- Create an account and log in
- Rate individual episodes and whole seasons
- Build a personal watchlist
- View watched shows, ratings, and profile stats

## Tech Stack

- Next.js App Router
- React
- SQLite with `better-sqlite3`
- Lucia Auth
- Tailwind CSS

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the example:

```bash
cp .env.example .env.local
```

3. Add your TMDB API key to `.env.local`.

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.
