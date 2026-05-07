import { loadPage } from "./router.js";
import { Navbar, initNavbar } from "./components/navbar.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const navbarEl = document.getElementById("navbar");

  // Tampilkan navbar hanya jika sudah login
  if (navbarEl && token) {
    navbarEl.innerHTML = Navbar();
    initNavbar((page) => loadPage(page));
  }

  const hash = location.hash.slice(2); // buang "#/"
  loadPage(hash || (token ? "dashboard" : "login"));
});

window.addEventListener("hashchange", () => {
  const page = location.hash.slice(2);
  loadPage(page);
});
