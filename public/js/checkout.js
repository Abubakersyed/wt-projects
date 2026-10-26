let data = null;
async function init() {
  const user = await MB.getSession();
  if (!user) { location.href = "/login.html"; return; }
  const raw = sessionStorage.getItem("checkout");
  if (!raw) { location.href = "/movies.html"; return; }
  data = JSON.parse(raw);
  const showRes = await MB.api("/theatres/show/" + data.showId);
  const show = showRes.show;
  const total = data.seatIds.reduce((sum, id) => {
    const s = show.seats.find(x => x.id === id);
    return sum + (s.type === "premium" ? show.pricePremium : show.priceRegular);
  }, 0);
  document.getElementById("details").innerHTML = `
    <div>Movie ID: ${show.movieId}</div>
    <div>Theatre: ${show.theatre.name}</div>
    <div>Date/Time: ${show.date} ${show.time}</div>
    <div>Seats: ${data.seatIds.join(", ")}</div>
    <div style="font-weight:700;margin-top:8px">Total: ${MB.money(total)}</div>`;
  document.getElementById("pay").onclick = pay;
}
async function pay() {
  const err = document.getElementById("err");
  err.textContent = "";
  const btn = document.getElementById("pay");
  btn.disabled = true; btn.textContent = "Processing...";
  // simulate delay
  await new Promise(r => setTimeout(r, 1200));
  try {
    const res = await MB.api("/bookings", { method: "POST", body: JSON.stringify({ showId: data.showId, seatIds: data.seatIds }) });
    sessionStorage.removeItem("checkout");
    location.href = "/confirmation.html?id=" + res.booking.id;
  } catch (e) {
    err.textContent = e.message;
    btn.disabled = false; btn.textContent = "Pay Now";
  }
}
init();
