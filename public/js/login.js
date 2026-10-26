document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submit").onclick = async () => {
    const err = document.getElementById("err");
    err.textContent = "";
    try {
      await MB.api("/auth/login", { method: "POST", body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      }) });
      const params = new URLSearchParams(location.search);
      location.href = params.get("next") || "/";
    } catch (e) { err.textContent = e.message; }
  };
});
