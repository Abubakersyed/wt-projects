const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 chars" });
    if (password !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });
    const user = await userService.createUser({ name, email, password });
    req.session.userId = user.id;
    res.json({ user });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const user = await userService.verifyUser(email, password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    req.session.userId = user.id;
    res.json({ user: userService.sanitize(user) });
  } catch (e) { next(e); }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get("/me", (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = userService.findById(req.session.userId);
  res.json({ user });
});

router.put("/profile", requireAuth, (req, res, next) => {
  try {
    const user = userService.updateUser(req.session.userId, req.body);
    res.json({ user });
  } catch (e) { next(e); }
});

module.exports = router;
