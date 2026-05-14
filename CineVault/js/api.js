const TVMAZE_URL = "https://api.tvmaze.com/shows";
const CACHE_KEY = "cinevault-shows";
let allShows = [];

async function fetchShows() {
  const response = await fetch(TVMAZE_URL);

  if (!response.ok) {
    throw new Error("Unable to load shows right now.");
  }

  allShows = await response.json();
  localStorage.setItem(CACHE_KEY, JSON.stringify(allShows));
  return allShows;
}

function getCachedShows() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
  } catch {
    return [];
  }
}
