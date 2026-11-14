// Shared top-nav wiring: user pill, Log out, mobile menu toggle.
(function () {
  const pill = document.getElementById("user-pill");
  const out = document.getElementById("logout-btn");
  const toggle = document.getElementById("nav-toggle");
  if (toggle) toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    document.getElementById("main-nav").classList.toggle("open", open);
  });
  if (out) out.addEventListener("click", async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }); } catch (_) {}
    try { sessionStorage.setItem("nex_wallet_restore_tries", "2"); } catch (_) {}
    location.href = "/login";
  });
  fetch("/api/auth/session", { credentials: "same-origin" }).then(r => r.json()).then(({ user }) => {
    if (!user) return;
    if (pill) { pill.textContent = user.name || user.email || "Signed in"; pill.classList.remove("hidden"); }
    if (out) out.classList.remove("hidden");
  }).catch(() => {});
})();
