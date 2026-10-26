const { readJson } = require("../utils/fileStore");

function allMovies() { return readJson("movies.json", []); }

function list({ q, genre, language, rating, status }) {
  let movies = allMovies();
  if (q) {
    const ql = q.toLowerCase();
    movies = movies.filter((m) => m.title.toLowerCase().includes(ql) || (m.cast || []).some((c) => c.toLowerCase().includes(ql)));
  }
  if (genre) movies = movies.filter((m) => (m.genre || []).includes(genre));
  if (language) movies = movies.filter((m) => m.language === language);
  if (rating) movies = movies.filter((m) => m.rating >= Number(rating));
  if (status) movies = movies.filter((m) => m.status === status);
  return movies;
}

function findById(id) { return allMovies().find((m) => m.id === id) || null; }

function genres() { return [...new Set(allMovies().flatMap((m) => m.genre || []))]; }
function languages() { return [...new Set(allMovies().map((m) => m.language))]; }

module.exports = { allMovies, list, findById, genres, languages };
