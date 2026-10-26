async function init() {
  const id = new URLSearchParams(location.search).get("id");
  try {
    const { booking } = await MB.api("/bookings/" + id);
    const showRes = await MB.api("/theatres/show/" + booking.showId);
    const show = showRes.show;
    // movie details
    const movieRes = await MB.api("/movies/" + show.movieId);
    const movie = movieRes.movie;
    document.getElementById("ticket").innerHTML = `
      <h2>Booking Confirmed</h2>
      <div style="color:var(--muted);font-size:13px">Ref: ${booking.id}</div>
      <hr style="border-color:var(--border);margin:14px 0">
      <div style="display:flex;gap:14px">
        <img src="${movie.poster}" style="width:90px;border-radius:8px" />
        <div>
          <strong>${movie.title}</strong><br>
          ${show.theatre.name}<br>
          ${show.date} • ${show.time}<br>
          Seats: ${booking.seats.join(", ")}<br>
          Total: ${MB.money(booking.total)}
        </div>
      </div>
      <div style="margin-top:12px;color:var(--gold)">Status: ${booking.status}</div>`;
  } catch (e) {
    document.getElementById("ticket").innerHTML = '<div class="empty">' + e.message + '</div>';
  }
}
init();
