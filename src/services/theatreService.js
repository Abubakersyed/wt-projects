const { readJson } = require("../utils/fileStore");
const movieService = require("./movieService");

function allTheatres() { return readJson("theatres.json", []); }
function findById(id) { return allTheatres().find((t) => t.id === id) || null; }

function showsForMovie(movieId) {
  const shows = readJson("shows.json", []);
  const theatres = allTheatres();
  const now = new Date();
  return shows
    .filter((s) => s.movieId === movieId)
    .map((s) => {
      const theatre = theatres.find((t) => t.id === s.theatreId);
      const past = new Date(s.date + "T" + s.time) < now;
      return { ...s, theatre, expired: past };
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

function findShow(id) {
  const shows = readJson("shows.json", []);
  const theatres = allTheatres();
  const s = shows.find((x) => x.id === id);
  if (!s) return null;
  return { ...s, theatre: theatres.find((t) => t.id === s.theatreId) };
}

function updateShow(show) {
  const shows = readJson("shows.json", []);
  const idx = shows.findIndex((s) => s.id === show.id);
  if (idx === -1) return false;
  shows[idx] = show;
  const { writeJson } = require("../utils/fileStore");
  writeJson("shows.json", shows);
  return true;
}

module.exports = { allTheatres, findById, showsForMovie, findShow, updateShow };
