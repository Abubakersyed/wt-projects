const express = require("express");
const router = express.Router();
const movieService = require("../services/movieService");

router.get("/", (req, res) => {
  const { q, genre, language, rating, status } = req.query;
  res.json({ movies: movieService.list({ q, genre, language, rating, status }) });
});

router.get("/meta", (req, res) => {
  res.json({ genres: movieService.genres(), languages: movieService.languages() });
});

router.get("/:id", (req, res) => {
  const m = movieService.findById(req.params.id);
  if (!m) return res.status(404).json({ error: "Movie not found" });
  res.json({ movie: m });
});

module.exports = router;
