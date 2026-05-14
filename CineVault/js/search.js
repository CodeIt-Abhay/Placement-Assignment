let activeFilter = "all";
let searchQuery = "";

function initSearch() {
  document.getElementById("searchInput").addEventListener("input", event => {
    searchQuery = event.target.value.trim().toLowerCase();
    visibleCount = 20;
    renderShows(getVisibleShows());
  });

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      visibleCount = 20;
      document.querySelectorAll("[data-filter]").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderShows(getVisibleShows());
    });
  });
}

function getVisibleShows() {
  let shows = [...allShows];

  if (activeFilter === "rating") {
    shows = shows
      .filter(show => Number(show.rating?.average))
      .sort((a, b) => b.rating.average - a.rating.average);
  }

  if (activeFilter === "recent") {
    shows = shows
      .filter(show => show.premiered)
      .sort((a, b) => new Date(b.premiered) - new Date(a.premiered));
  }

  if (!searchQuery) return shows;

  return shows.filter(show => {
    const year = show.premiered ? show.premiered.slice(0, 4) : "";
    const genres = (show.genres || []).join(" ").toLowerCase();
    return `${show.name} ${genres} ${year}`.toLowerCase().includes(searchQuery);
  });
}
