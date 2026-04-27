import { Login, initLogin } from "./pages/login.js";
import { Dashboard, initDashboard } from "./pages/dashboard.js";
import { MasterBarang, initMasterBarang } from "./pages/master-barang.js";
import { TransaksiMasuk, initTransaksiMasuk } from "./pages/transaksi-masuk.js";
import { TransaksiKeluar, initTransaksiKeluar } from "./pages/transaksi-keluar.js";
import { Laporan, initLaporan } from "./pages/laporan.js";
import { Purchasing, initPurchasing } from "./pages/purchasing.js";
import { Inventaris, initInventaris } from "./pages/inventaris.js";

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function loadPage(page = "dashboard") {
  const app = document.getElementById("app");
  if (!app) return;

  page = page.replace("#/", "").replace("/", "");

  if (!isLoggedIn() && page !== "login") {
    window.location.hash = "/login";
    return;
  }

  switch (page) {
    case "login":
      app.innerHTML = Login();
      initLogin(() => {
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
