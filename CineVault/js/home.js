let visibleCount = 20;

const container = document.getElementById("movies");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const heroBackdrop = document.getElementById("heroBackdrop");
const heroTitle = document.getElementById("heroTitle");
const heroSummary = document.getElementById("heroSummary");
const heroMeta = document.getElementById("heroMeta");

function renderShows(list) {
  const visibleShows = list.slice(0, visibleCount);

  container.innerHTML = "";
  emptyState.hidden = list.length > 0;
  resultCount.textContent = `${list.length} show${list.length === 1 ? "" : "s"} found`;

  visibleShows.forEach((show, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${Math.min(index * 24, 240)}ms`;
    card.innerHTML = createShowCard(show);
    card.addEventListener("click", () => addToHistory(show));
    container.appendChild(card);
  });
}

function createShowCard(show) {
  const image = show.image?.medium || "https://via.placeholder.com/420x590/181818/ffffff?text=No+Image";
  const rating = show.rating?.average ? `★ ${show.rating.average}` : "New";
  const year = show.premiered ? show.premiered.slice(0, 4) : "TBA";
  const genres = (show.genres || []).slice(0, 2);

  return `
    <img src="${image}" alt="${escapeHtml(show.name)} poster" loading="lazy">
    <div class="card-info">
      <p>${escapeHtml(show.name)}</p>
      <div class="card-meta">
        <span>${rating}</span>
        <span>${year}</span>
      </div>
      <div class="card-genres">
        ${genres.map(genre => `<span>${escapeHtml(genre)}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderHero(show) {
  if (!show) return;

  const image = show.image?.original || show.image?.medium || "";
  heroBackdrop.style.backgroundImage = `
    linear-gradient(90deg, rgba(5, 5, 5, 0.98) 0%, rgba(5, 5, 5, 0.62) 42%, rgba(5, 5, 5, 0.9) 100%),
    linear-gradient(0deg, var(--ink) 0%, rgba(5, 5, 5, 0.12) 44%, rgba(5, 5, 5, 0.68) 100%),
    url('${image}')
  `;
  heroTitle.textContent = show.name;
  heroSummary.textContent = stripHtml(show.summary) || "A standout pick from the catalogue.";
  heroMeta.innerHTML = [
    show.rating?.average ? `Rating ${show.rating.average}` : "Fresh pick",
    show.premiered ? show.premiered.slice(0, 4) : "Coming soon",
    ...(show.genres || []).slice(0, 2)
  ].map(item => `<span>${escapeHtml(item)}</span>`).join("");
}

function renderSkeletons() {
  container.innerHTML = Array.from({ length: 12 }, () => `<div class="skeleton"></div>`).join("");
}

function renderError(message) {
  container.innerHTML = "";
  emptyState.hidden = false;
  emptyState.querySelector("h3").textContent = "Could not load shows";
  emptyState.querySelector("p").textContent = message;
  resultCount.textContent = "No data available";
}

function pickFeaturedShow(shows) {
  return shows
    .filter(show => show.image?.original && Number(show.rating?.average))
    .sort((a, b) => b.rating.average - a.rating.average)[0] || shows[0];
}

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, "").trim();
}

function escapeHtml(value = "") {
  return value
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY < document.body.offsetHeight - 360) return;

  const shows = getVisibleShows();
  if (visibleCount >= shows.length) return;

  visibleCount += 20;
  renderShows(shows);
});

(async function init() {
  renderSkeletons();

  try {
    allShows = navigator.onLine ? await fetchShows() : getCachedShows();

    if (!allShows.length) {
      throw new Error("Connect to the internet once to cache the catalogue.");
    }

    initSearch();
    renderHero(pickFeaturedShow(allShows));
    renderShows(getVisibleShows());
  } catch (error) {
    renderError(error.message);
  }
})();
