// client/app.js
import { loadPage } from "./router.js";
import { Navbar, initNavbar } from "./components/navbar.js";
import { initStore } from "./services/data-store.js";

document.addEventListener("DOMContentLoaded", () => {
    // init data store (seed pertama kali)
    initStore();

    // render navbar
    document.getElementById("navbar").innerHTML = Navbar();
    initNavbar((page) => loadPage(page));

    // redirect awal berdasarkan login
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    loadPage(isLoggedIn ? "dashboard" : "login");
});