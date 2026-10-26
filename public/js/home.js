async function loadMovies(status, containerId) {
  const data = await MB.api(`/movies?status=${status}`);
  const el = document.getElementById(containerId);
  if (!data.movies.length) { el.innerHTML = '<div class="empty">No movies</div>'; return; }
  el.innerHTML = data.movies.map(m => `
    <a class="card" href="/movie-details.html?id=${m.id}">
      <img src="${m.poster}" alt="${m.title}" />
      <div class="card-body">
        <div class="card-title">${m.title}</div>
        <div class="meta">
          <span>${m.genre.join(", ")}</span>
          <span>⭐ ${m.rating}</span>
          <span>${m.duration}m</span>
        </div>
      </div>
    </a>`).join("");
}
async function init() {
  const all = await MB.api("/movies");
  const heroMovie = all.movies[0];
  if (heroMovie) {
    document.getElementById("hero").innerHTML = `
      <img src="${heroMovie.backdrop}" alt="${heroMovie.title}" />
      <div class="hero-content">
        <h1>${heroMovie.title}</h1>
        <p>${heroMovie.synopsis}</p>
        <a class="btn primary" href="/movie-details.html?id=${heroMovie.id}">Book Tickets</a>
      </div>`;
  }
  loadMovies("now", "now");
  loadMovies("trending", "trending");
  loadMovies("coming", "coming");
}
init();
