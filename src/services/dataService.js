const { readJson, writeJson } = require("../utils/fileStore");

const FILES = ["users.json", "movies.json", "theatres.json", "shows.json", "bookings.json"];

function initData() {
  FILES.forEach((f) => {
    const data = readJson(f, null);
    if (data === null) {
      if (f === "users.json") writeJson(f, []);
      else if (f === "movies.json") writeJson(f, seedMovies());
      else if (f === "theatres.json") writeJson(f, seedTheatres());
      else if (f === "shows.json") writeJson(f, seedShows());
      else if (f === "bookings.json") writeJson(f, []);
    }
  });
}

function seedMovies() {
  return [
    { id: "m1", title: "The Last Horizon", genre: ["Sci-Fi", "Adventure"], language: "English", rating: 8.4, duration: 142, releaseDate: "2026-01-15", status: "now", poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", synopsis: "A crew ventures beyond the edge of known space to save humanity.", cast: ["A. Rivera", "B. Chen", "C. Okafor"] },
    { id: "m2", title: "Crimson Vow", genre: ["Action", "Thriller"], language: "English", rating: 7.9, duration: 118, releaseDate: "2026-02-10", status: "now", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7ha9zXrEo.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7ha9zXrEo.jpg", synopsis: "An assassin breaks her oath to protect the one person she was sent to kill.", cast: ["D. Park", "E. Silva"] },
    { id: "m3", title: "Whispers in the Pines", genre: ["Horror", "Mystery"], language: "English", rating: 7.2, duration: 104, releaseDate: "2026-03-01", status: "now", poster: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", synopsis: "A journalist uncovers a town's buried secret in the northern woods.", cast: ["F. Nguyen", "G. Patel"] },
    { id: "m4", title: "Neon Dreams", genre: ["Drama", "Romance"], language: "English", rating: 8.1, duration: 126, releaseDate: "2026-04-20", status: "coming", poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", synopsis: "Two artists chase fame in a city that never sleeps.", cast: ["H. Lopez", "I. Ahmed"] },
    { id: "m5", title: "Dragon's Oath", genre: ["Fantasy", "Action"], language: "Hindi", rating: 8.7, duration: 155, releaseDate: "2026-05-05", status: "coming", poster: "https://image.tmdb.org/t/p/w500/5a4JdoFwll5DRtKMe7JLuG3yWn.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/5a4JdoFwll5DRtKMe7JLuG3yWn.jpg", synopsis: "A warrior bonds with the last dragon to defy an empire.", cast: ["J. Khan", "K. Verma"] },
    { id: "m6", title: "Laugh Track", genre: ["Comedy"], language: "English", rating: 6.8, duration: 95, releaseDate: "2026-01-02", status: "trending", poster: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", synopsis: "A failed comedian accidentally becomes a viral therapist.", cast: ["L. Brown", "M. White"] },
  ];
}

function seedTheatres() {
  return [
    { id: "t1", name: "Grand Cinema", city: "Mumbai", address: "Downtown Mall, Mumbai" },
    { id: "t2", name: "Starlight Multiplex", city: "Delhi", address: "City Center, Delhi" },
    { id: "t3", name: "Royal Screens", city: "Bangalore", address: "Tech Park, Bangalore" },
  ];
}

function seedShows() {
  const today = new Date();
  const dates = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const shows = [];
  let sid = 1;
  const movies = ["m1", "m2", "m3", "m6"];
  const times = ["10:00", "13:30", "17:00", "20:30"];
  movies.forEach((m) => {
    ["t1", "t2"].forEach((t) => {
      dates.forEach((date) => {
        times.slice(0, 2 + (sid % 2)).forEach((time) => {
          shows.push({
            id: `s${sid++}`,
            movieId: m,
            theatreId: t,
            date,
            time,
            priceRegular: 250,
            pricePremium: 400,
            seats: makeSeats(8, 10),
          });
        });
      });
    });
  });
  return shows;
}

function makeSeats(rows, cols) {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    const row = String.fromCharCode(65 + r);
    for (let c = 1; c <= cols; c++) {
      const premium = r >= 6;
      seats.push({ id: `${row}${c}`, row, number: c, type: premium ? "premium" : "regular", booked: false });
    }
  }
  return seats;
}

module.exports = { initData };
module.exports.seedMovies = seedMovies;
module.exports.seedTheatres = seedTheatres;
module.exports.seedShows = seedShows;
