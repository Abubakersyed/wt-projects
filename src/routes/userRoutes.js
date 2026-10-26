const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const userService = require("../services/userService");

router.get("/profile", requireAuth, (req, res) => {
  res.json({ user: userService.findById(req.session.userId) });
});

router.put("/profile", requireAuth, (req, res, next) => {
  try {
    const user = userService.updateUser(req.session.userId, req.body);
    res.json({ user });
  } catch (e) { next(e); }
});

module.exports = router;
