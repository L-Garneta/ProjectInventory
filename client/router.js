import { Login, initLogin } from "./pages/login.js";
import { Dashboard, initDashboard } from "./pages/dashboard.js";
import { MasterBarang, initMasterBarang } from "./pages/master-barang.js";
import { TransaksiMasuk, initTransaksiMasuk } from "./pages/transaksi-masuk.js";
import {
  TransaksiKeluar,
  initTransaksiKeluar,
} from "./pages/transaksi-keluar.js";
import { Laporan, initLaporan } from "./pages/laporan.js";
import { Purchasing, initPurchasing } from "./pages/purchasing.js";
import { Inventaris, initInventaris } from "./pages/inventaris.js";
import { isAdmin } from "./auth.js";

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// Halaman yang hanya boleh diakses admin
const ADMIN_ONLY_PAGES = ["purchasing", "transaksi-masuk", "transaksi-keluar"];

export function loadPage(page = "dashboard") {
  const app = document.getElementById("app");
  if (!app) return;

  page = page.replace("#/", "").replace("/", "");

  // Belum login → redirect ke login
  if (!isLoggedIn() && page !== "login") {
    window.location.hash = "/login";
    return;
  }

  // Staff coba akses halaman admin → redirect ke dashboard
  if (isLoggedIn() && ADMIN_ONLY_PAGES.includes(page) && !isAdmin()) {
    app.innerHTML = `
      <div class="page d-flex align-items-center justify-content-center" style="min-height:60vh">
        <div class="text-center">
          <h3>🚫 Akses Ditolak</h3>
          <p class="text-muted">Halaman ini hanya bisa diakses oleh Admin.</p>
          <a href="#/dashboard" class="btn btn-primary mt-2">Kembali ke Dashboard</a>
        </div>
      </div>
    `;
    return;
  }

  switch (page) {
    case "login":
      app.innerHTML = Login();
      initLogin(() => {
        // Setelah login, rebuild navbar sesuai role baru
        const navbarEl = document.getElementById("navbar");
        if (navbarEl) {
          import("./components/navbar.js").then(({ Navbar, initNavbar }) => {
            navbarEl.innerHTML = Navbar();
            initNavbar((p) => loadPage(p));
          });
        }
        window.location.hash = "/dashboard";
      });
      break;

    case "dashboard":
      app.innerHTML = Dashboard();
      initDashboard();
      break;

    case "master-barang":
      app.innerHTML = MasterBarang();
      initMasterBarang();
      break;

    case "transaksi-masuk":
      app.innerHTML = TransaksiMasuk();
      initTransaksiMasuk();
      break;

    case "transaksi-keluar":
      app.innerHTML = TransaksiKeluar();
      initTransaksiKeluar();
      break;

    case "laporan":
      app.innerHTML = Laporan();
      initLaporan();
      break;

    case "purchasing":
      app.innerHTML = Purchasing();
      initPurchasing();
      break;

    case "inventaris":
      app.innerHTML = Inventaris();
      initInventaris();
      break;

    default:
      app.innerHTML = "<h2>Halaman tidak ditemukan</h2>";
  }
}
