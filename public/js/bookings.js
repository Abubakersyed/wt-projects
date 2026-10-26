async function init() {
  const user = await MB.getSession();
  if (!user) { location.href = "/login.html"; return; }
  const data = await MB.api("/bookings/my");
  const list = document.getElementById("list");
  if (!data.bookings.length) { list.innerHTML = '<div class="empty">No bookings yet</div>'; return; }
  list.innerHTML = data.bookings.map(b => {
    const show = b.show;
    const movie = b.movie;
    const past = show && new Date(show.date + "T" + show.time) < new Date();
    return `<div class="booking-card">
      <img src="${movie ? movie.poster : ''}" />
      <div>
        <strong>${movie ? movie.title : "Movie"}</strong><br>
        ${show ? show.theatre.name : ""}<br>
        ${show ? show.date + " • " + show.time : ""}<br>
        Seats: ${b.seats.join(", ")}<br>
        Total: ${MB.money(b.total)}<br>
        Status: ${b.status} ${past ? "(Past)" : "(Upcoming)"}
        <div style="margin-top:8px">
          <a class="btn" href="/confirmation.html?id=${b.id}">View Ticket</a>
          ${b.status === "confirmed" && !past ? `<button class="btn danger" data-id="${b.id}">Cancel</button>` : ""}
        </div>
      </div>
    </div>`;
  }).join("");
  list.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = async () => {
      if (!confirm("Cancel this booking?")) return;
      try {
        await MB.api("/bookings/" + btn.dataset.id + "/cancel", { method: "POST" });
        MB.toast("Booking cancelled");
        init();
      } catch (e) { MB.toast(e.message, "error"); }
    };
  });
}
init();
