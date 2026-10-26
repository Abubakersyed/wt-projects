async function loadMeta() {
  const data = await MB.api("/movies/meta");
  const g = document.getElementById("genre");
  const l = document.getElementById("language");
  data.genres.forEach(x => { const o = document.createElement("option"); o.value = x; o.textContent = x; g.appendChild(o); });
  data.languages.forEach(x => { const o = document.createElement("option"); o.value = x; o.textContent = x; l.appendChild(o); });
}
async function load() {
  const q = document.getElementById("q").value;
  const genre = document.getElementById("genre").value;
  const language = document.getElementById("language").value;
  const rating = document.getElementById("rating").value;
  const status = document.getElementById("status").value;
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (genre) params.set("genre", genre);
  if (language) params.set("language", language);
  if (rating) params.set("rating", rating);
  if (status) params.set("status", status);
  const data = await MB.api("/movies?" + params.toString());
  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty");
  if (!data.movies.length) { grid.innerHTML = ""; empty.style.display = "block"; return; }
  empty.style.display = "none";
  grid.innerHTML = data.movies.map(m => `
    <a class="card" href="/movie-details.html?id=${m.id}">
      <img src="${m.poster}" alt="${m.title}" />
      <div class="card-body">
        <div class="card-title">${m.title}</div>
        <div class="meta"><span>${m.genre.join(", ")}</span><span>⭐ ${m.rating}</span><span>${m.language}</span></div>
      </div>
    </a>`).join("");
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadMeta();
  await load();
  ["q","genre","language","rating","status"].forEach(id => document.getElementById(id).addEventListener("input", load));
  document.getElementById("q").addEventListener("keyup", load);
});
