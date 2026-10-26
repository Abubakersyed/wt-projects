const { readJson, writeJson, withGlobalLock } = require("../utils/fileStore");
const theatreService = require("./theatreService");

function generateId() { return "BK" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(); }

function userBookings(userId) {
  const bookings = readJson("bookings.json", []);
  return bookings.filter((b) => b.userId === userId).map((b) => {
    const show = theatreService.findShow(b.showId);
    return { ...b, show, movie: show ? require("./movieService").findById(show.movieId) : null };
  });
}

function findById(id) { return readJson("bookings.json", []).find((b) => b.id === id) || null; }

function createBooking({ userId, showId, seatIds }) {
  return withGlobalLock(() => {
  const shows = readJson("shows.json", []);
  const showIdx = shows.findIndex((s) => s.id === showId);
  if (showIdx === -1) { const e = new Error("Show not found"); e.status = 404; throw e; }
  const show = shows[showIdx];
  // expired?
  if (new Date(show.date + "T" + show.time) < new Date()) { const e = new Error("Show expired"); e.status = 400; throw e; }
  // validate seats
  const seatSet = new Set(seatIds);
  if (seatSet.size !== seatIds.length) { const e = new Error("Duplicate seats"); e.status = 400; throw e; }
  if (seatIds.length === 0) { const e = new Error("No seats selected"); e.status = 400; throw e; }
  for (const sid of seatIds) {
    const seat = show.seats.find((s) => s.id === sid);
    if (!seat) { const e = new Error("Invalid seat " + sid); e.status = 400; throw e; }
    if (seat.booked) { const e = new Error("Seat already booked: " + sid); e.status = 409; throw e; }
  }
  // mark seats booked
  seatIds.forEach((sid) => {
    const seat = show.seats.find((s) => s.id === sid);
    seat.booked = true;
    seat.bookedBy = userId;
  });
  shows[showIdx] = show;
  writeJson("shows.json", shows);

  const total = seatIds.reduce((sum, sid) => {
    const seat = show.seats.find((s) => s.id === sid);
    return sum + (seat.type === "premium" ? show.pricePremium : show.priceRegular);
  }, 0);

  const booking = {
    id: generateId(),
    userId,
    showId,
    seats: seatIds,
    total,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  const bookings = readJson("bookings.json", []);
  bookings.push(booking);
  writeJson("bookings.json", bookings);
  return booking;
  });
}

function cancelBooking(id, userId) {
  return withGlobalLock(() => {
  const bookings = readJson("bookings.json", []);
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) { const e = new Error("Booking not found"); e.status = 404; throw e; }
  const booking = bookings[idx];
  if (booking.userId !== userId) { const e = new Error("Forbidden"); e.status = 403; throw e; }
  if (booking.status !== "confirmed") { const e = new Error("Booking not cancellable"); e.status = 400; throw e; }
  const show = theatreService.findShow(booking.showId);
  if (show && new Date(show.date + "T" + show.time) < new Date()) { const e = new Error("Show already started"); e.status = 400; throw e; }
  // release seats
  if (show) {
    booking.seats.forEach((sid) => {
      const seat = show.seats.find((s) => s.id === sid);
      if (seat) { seat.booked = false; delete seat.bookedBy; }
    });
    theatreService.updateShow(show);
  }
  bookings[idx].status = "cancelled";
  bookings[idx].cancelledAt = new Date().toISOString();
  writeJson("bookings.json", bookings);
  return bookings[idx];
  });
}

module.exports = { userBookings, findById, createBooking, cancelBooking };
