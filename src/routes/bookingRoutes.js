const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const bookingService = require("../services/bookingService");

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { showId, seatIds } = req.body;
    if (!showId || !Array.isArray(seatIds)) return res.status(400).json({ error: "Invalid request" });
    const booking = await bookingService.createBooking({ userId: req.session.userId, showId, seatIds });
    res.status(201).json({ booking });
  } catch (e) { next(e); }
});

router.get("/my", requireAuth, (req, res) => {
  res.json({ bookings: bookingService.userBookings(req.session.userId) });
});

router.get("/:id", requireAuth, (req, res, next) => {
  try {
    const b = bookingService.findById(req.params.id);
    if (!b) return res.status(404).json({ error: "Not found" });
    if (b.userId !== req.session.userId) return res.status(403).json({ error: "Forbidden" });
    res.json({ booking: b });
  } catch (e) { next(e); }
});

router.post("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.session.userId);
    res.json({ booking });
  } catch (e) { next(e); }
});

module.exports = router;
