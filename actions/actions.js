// get current popular tv shows
export async function getPopular() {
  const API_KEY = process.env.TMDB_API_KEY;
  console.log("TMDB_API_KEY present?", Boolean(API_KEY));

  const url = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=1&api_key=${API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    const text = await res.text().catch(() => "<no body>");
    throw new Error(
      `Failed to fetch shows — status: ${res.status} ${res.statusText} — body: ${text}`
    );
  }

  const data = await res.json();

  // filter to only English shows
  const filteredResults = data.results.filter(
    (show) => show.original_language === "en"
  );

  return {
    ...data,
    results: filteredResults,
  };
}

// get current trending tv shows
export async function getTrending() {
  const API_KEY = process.env.TMDB_API_KEY;
  console.log("TMDB_API_KEY present?", Boolean(API_KEY));

  const url = `https://api.themoviedb.org/3/tv/week?language=en-US&page=1&api_key=${API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    const text = await res.text().catch(() => "<no body>");
    throw new Error(
      `Failed to fetch shows — status: ${res.status} ${res.statusText} — body: ${text}`
    );
  }

  const data = await res.json();

  // filter to only English shows
  const filteredResults = data.results.filter(
    (show) => show.original_language === "en"
  );

  return {
    ...data,
    results: filteredResults,
  };
}

// Fetch show details from TMDB API
// src/actions/actions.js
export async function getTVDetails(showID) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYjNhOWY1ODFkZmNkM2JlOWRhMWY1YjY5Y2JiOTI1ZSIsIm5iZiI6MTc0MjY2OTUzNS41MzYsInN1YiI6IjY3ZGYwNmRmYjhlMGZlYTkzNDA3YjIzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XDdAstLPRdpZk__A0i_T2L0qkF9IvdjBsmO_ul4fxFM",
    },
  };

  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${showID}?language=en-US`,
    options
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch show ${showID}: ${res.status}`);
  }

  return res.json();
}

export async function getSeasonDetails(showID, seasonNumber) {
  // console.log("=== GET SEASON DETAILS ===");
  // console.log("showID:", showID);
  // console.log("seasonNumber:", seasonNumber);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYjNhOWY1ODFkZmNkM2JlOWRhMWY1YjY5Y2JiOTI1ZSIsIm5iZiI6MTc0MjY2OTUzNS41MzYsInN1YiI6IjY3ZGYwNmRmYjhlMGZlYTkzNDA3YjIzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XDdAstLPRdpZk__A0i_T2L0qkF9IvdjBsmO_ul4fxFM",
    },
  };

  const url = `https://api.themoviedb.org/3/tv/${showID}/season/${seasonNumber}?language=en-US`;
  console.log("Fetching URL:", url);

  const res = await fetch(url, options);

  if (!res.ok) {
    console.error("Fetch failed:", res.status, res.statusText);
    throw new Error(
      `Failed to fetch season ${seasonNumber} for show ${showID}: ${res.status}`
    );
  }

  const data = await res.json();
  console.log(
    "Season data received:",
    data?.name,
    "Episodes:",
    data?.episodes?.length
  );

  return data;
}

export async function getEpisodeDetails(showId, seasonNumber, episodeNumber) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYjNhOWY1ODFkZmNkM2JlOWRhMWY1YjY5Y2JiOTI1ZSIsIm5iZiI6MTc0MjY2OTUzNS41MzYsInN1YiI6IjY3ZGYwNmRmYjhlMGZlYTkzNDA3YjIzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XDdAstLPRdpZk__A0i_T2L0qkF9IvdjBsmO_ul4fxFM",
    },
  };

  const url = `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}?language=en-US`;
  console.log("Fetching URL:", url);

  const res = await fetch(url, options);

  if (!res.ok) {
    console.error("Fetch failed:", res.status, res.statusText);
    throw new Error(
      `Failed to fetch episode ${episodeNumber} for season ${seasonNumber} for show ${showID}: ${res.status}`
    );
  }

  const data = await res.json();
  console.log(
    "Episode data received:",
    data?.name,
    "Episodes:",
    data?.episodes?.length
  );

  return data;
}

export async function getCastDetails(showId) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYjNhOWY1ODFkZmNkM2JlOWRhMWY1YjY5Y2JiOTI1ZSIsIm5iZiI6MTc0MjY2OTUzNS41MzYsInN1YiI6IjY3ZGYwNmRmYjhlMGZlYTkzNDA3YjIzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XDdAstLPRdpZk__A0i_T2L0qkF9IvdjBsmO_ul4fxFM",
    },
  };

  const url = `https://api.themoviedb.org/3/tv/${showId}/aggregate_credits?language=en-US`;
  console.log("Fetching URL:", url);

  const res = await fetch(url, options);

  if (!res.ok) {
    console.error("Fetch failed:", res.status, res.statusText);
    throw new Error(
      `Failed to fetch cast for show with showId = ${showId}`
    );
  }

  const data = await res.json();

  return data;
}

export async function getSimilarshows(showId) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYjNhOWY1ODFkZmNkM2JlOWRhMWY1YjY5Y2JiOTI1ZSIsIm5iZiI6MTc0MjY2OTUzNS41MzYsInN1YiI6IjY3ZGYwNmRmYjhlMGZlYTkzNDA3YjIzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XDdAstLPRdpZk__A0i_T2L0qkF9IvdjBsmO_ul4fxFM",
    },
  };

  const url = `https://api.themoviedb.org/3/tv/${showId}/similar?language=en-US&page=1`;
  console.log("Fetching URL:", url);

  const res = await fetch(url, options);

  if (!res.ok) {
    console.error("Fetch failed:", res.status, res.statusText);
    throw new Error(
      `Failed to fetch cast for show with showId = ${showId}`
    );
  }

  const data = await res.json();

  return data;
}

export default async function getShowById(showId){
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYjNhOWY1ODFkZmNkM2JlOWRhMWY1YjY5Y2JiOTI1ZSIsIm5iZiI6MTc0MjY2OTUzNS41MzYsInN1YiI6IjY3ZGYwNmRmYjhlMGZlYTkzNDA3YjIzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XDdAstLPRdpZk__A0i_T2L0qkF9IvdjBsmO_ul4fxFM",
    },
  };

  const url = `https://api.themoviedb.org/3/tv/${showId}?language=en-US`;
  console.log("Fetching URL:", url);

  const res = await fetch(url, options);

  if (!res.ok) {
    console.error("Fetch failed:", res.status, res.statusText);
    throw new Error(
      `Failed to fetch cast for show with showId = ${showId}`
    );
  }

  const data = await res.json();

  return data;
}

