document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submit").onclick = async () => {
    const err = document.getElementById("err");
    err.textContent = "";
    try {
      await MB.api("/auth/signup", { method: "POST", body: JSON.stringify({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirm").value
      }) });
      location.href = "/";
    } catch (e) { err.textContent = e.message; }
  };
});
