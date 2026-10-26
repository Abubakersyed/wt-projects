const API = "/api";
function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", ...(opts.headers || {}) };
  return fetch(API + path, { ...opts, headers, credentials: "same-origin" }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || "Request failed");
    return data;
  });
}
function toast(msg, type = "") {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = "toast show " + type;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 3000);
}
async function getSession() {
  try { const d = await api("/auth/me"); return d.user; } catch { return null; }
}
function renderNav(user) {
  const el = document.getElementById("nav-auth");
  if (!el) return;
  if (user) {
    el.innerHTML = `<a href="/profile.html">Profile</a><a href="#" id="logout">Logout</a>`;
    document.getElementById("logout").onclick = async (e) => { e.preventDefault(); await api("/auth/logout", { method: "POST" }); location.href = "/"; };
  } else {
    el.innerHTML = `<a href="/login.html">Login</a><a href="/signup.html">Signup</a>`;
  }
}
function money(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function imgFallback(img) { img.onerror = () => { img.src = "https://via.placeholder.com/300x450?text=No+Image"; }; }
document.addEventListener("DOMContentLoaded", async () => {
  const user = await getSession();
  renderNav(user);
  document.querySelectorAll("img").forEach(imgFallback);
});
window.MB = { api, toast, getSession, renderNav, money };
