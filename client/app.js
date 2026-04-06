import { loadPage } from "./router.js";
import { Navbar, initNavbar } from "./components/navbar.js";

document.addEventListener("DOMContentLoaded", () => {
  const navbarEl = document.getElementById("navbar");

  if (navbarEl) {
    navbarEl.innerHTML = Navbar();
    initNavbar((page) => loadPage(page));
  }

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  loadPage(isLoggedIn ? "dashboard" : "login");
});

window.addEventListener("hashchange", () => {
  const page = location.hash.slice(2); // buang "#/"
  loadPage(page);
});
