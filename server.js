require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { initData } = require("./src/services/dataService");
const authRoutes = require("./src/routes/authRoutes");
const movieRoutes = require("./src/routes/movieRoutes");
const theatreRoutes = require("./src/routes/theatreRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

initData();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: "mb.sid",
  secret: process.env.SESSION_SECRET || "dev-secret-change-me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: "Too many attempts, try later" } });
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/signup", loginLimiter);

app.use("/api", (req, res, next) => {
  // basic CSRF: require custom header for state-changing requests
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    if (req.headers["x-requested-with"] !== "XMLHttpRequest") {
      return res.status(403).json({ error: "Forbidden" });
    }
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/user", userRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Movie booking running at http://localhost:${PORT}`);
});
