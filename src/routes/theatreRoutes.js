const express = require("express");
const router = express.Router();
const theatreService = require("../services/theatreService");

router.get("/", (req, res) => res.json({ theatres: theatreService.allTheatres() }));
router.get("/:id", (req, res) => {
  const t = theatreService.findById(req.params.id);
  if (!t) return res.status(404).json({ error: "Theatre not found" });
  res.json({ theatre: t });
});
router.get("/movie/:movieId", (req, res) => {
  res.json({ shows: theatreService.showsForMovie(req.params.movieId) });
});
router.get("/show/:id", (req, res) => {
  const s = theatreService.findShow(req.params.id);
  if (!s) return res.status(404).json({ error: "Show not found" });
  res.json({ show: s });
});

module.exports = router;
