async function init() {
  const user = await MB.getSession();
  if (!user) { location.href = "/login.html"; return; }
  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
  document.getElementById("phone").value = user.profile?.phone || "";
  document.getElementById("city").value = user.profile?.city || "";
  document.getElementById("save").onclick = async () => {
    const err = document.getElementById("err");
    err.textContent = "";
    try {
      await MB.api("/user/profile", { method: "PUT", body: JSON.stringify({
        name: document.getElementById("name").value,
        profile: { phone: document.getElementById("phone").value, city: document.getElementById("city").value }
      }) });
      MB.toast("Profile updated");
    } catch (e) { err.textContent = e.message; }
  };
}
init();
