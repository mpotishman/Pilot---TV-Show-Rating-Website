const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  if (!TMDB_API_KEY) {
    throw new Error("Missing TMDB_API_KEY");
  }

  return TMDB_API_KEY;
}

async function fetchTMDB(path, { searchParams = {}, revalidate = 3600 } = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("language", "en-US");

  for (const [key, value] of Object.entries(searchParams)) {
    if (value != null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    next: { revalidate },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "<no body>");
    throw new Error(
      `TMDB request failed for ${path}: ${response.status} ${response.statusText} - ${text}`
    );
  }

  return response.json();
}

function filterEnglishResults(data) {
  return {
    ...data,
    results: Array.isArray(data?.results)
      ? data.results.filter((show) => show.original_language === "en")
      : [],
  };
}

export async function getPopular() {
  const data = await fetchTMDB("/tv/popular", {
    searchParams: { page: 1 },
    revalidate: 60,
  });

  return filterEnglishResults(data);
}

export async function getTrending() {
  const data = await fetchTMDB("/trending/tv/week", {
    searchParams: { page: 1 },
    revalidate: 60,
  });

  return filterEnglishResults(data);
}

export async function getTVDetails(showId) {
  return fetchTMDB(`/tv/${showId}`);
}

export async function getSeasonDetails(showId, seasonNumber) {
  return fetchTMDB(`/tv/${showId}/season/${seasonNumber}`);
}

export async function getEpisodeDetails(showId, seasonNumber, episodeNumber) {
  return fetchTMDB(
    `/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`
  );
}

export async function getCastDetails(showId) {
  return fetchTMDB(`/tv/${showId}/aggregate_credits`);
}

export async function getSimilarshows(showId) {
  return fetchTMDB(`/tv/${showId}/similar`, {
    searchParams: { page: 1 },
  });
}

export default async function getShowById(showId) {
  return getTVDetails(showId);
}
