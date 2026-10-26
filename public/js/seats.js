const showId = new URLSearchParams(location.search).get("show");
let selected = new Set();
let show = null;

async function init() {
  const user = await MB.getSession();
  if (!user) { location.href = "/login.html?next=" + encodeURIComponent(location.href); return; }
  const data = await MB.api("/theatres/show/" + showId);
  show = data.show;
  document.getElementById("showinfo").textContent = `${show.movieId} • ${show.theatre.name} • ${show.date} ${show.time}`;
  renderSeats();
  document.getElementById("proceed").onclick = proceed;
}

function renderSeats() {
  const container = document.getElementById("seats");
  const rows = {};
  show.seats.forEach(s => { (rows[s.row] = rows[s.row] || []).push(s); });
  container.innerHTML = Object.keys(rows).sort().map(row => `
    <div class="seat-row">
      <span style="width:20px;color:var(--muted)">${row}</span>
      ${rows[row].map(s => `<button class="seat ${s.type} ${s.booked ? "booked" : ""} ${selected.has(s.id) ? "selected" : ""}" data-id="${s.id}" ${s.booked ? "disabled" : ""}>${s.number}</button>`).join("")}
    </div>`).join("");
  container.querySelectorAll(".seat:not(.booked)").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      if (selected.has(id)) selected.delete(id); else selected.add(id);
      updateSummary();
      renderSeats();
    };
  });
  updateSummary();
}

function updateSummary() {
  const list = document.getElementById("selList");
  const totalEl = document.getElementById("total");
  const btn = document.getElementById("proceed");
  if (selected.size === 0) {
    list.textContent = "No seats selected";
    totalEl.textContent = "Total: ₹0";
    btn.disabled = true;
    return;
  }
  let total = 0;
  selected.forEach(id => {
    const s = show.seats.find(x => x.id === id);
    total += s.type === "premium" ? show.pricePremium : show.priceRegular;
  });
  list.textContent = "Seats: " + [...selected].join(", ") + " (" + selected.size + ")";
  totalEl.textContent = "Total: " + MB.money(total);
  btn.disabled = false;
}

function proceed() {
  sessionStorage.setItem("checkout", JSON.stringify({ showId, seatIds: [...selected] }));
  location.href = "/checkout.html";
}

init();
