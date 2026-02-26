import { Dashboard, initDashboard } from "./pages/dashboard.js";
import { MasterBarang, initMasterBarang } from "./pages/master-barang.js";
import { TransaksiMasuk, initTransaksiMasuk } from "./pages/transaksi-masuk.js";
import { TransaksiKeluar, initTransaksiKeluar } from "./pages/transaksi-keluar.js";
import { Laporan, initLaporan } from "./pages/laporan.js";
import { Login, initLogin } from "./pages/login.js";

function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

export function loadPage(page) {
    const app = document.getElementById("app");

    // proteksi halaman (kecuali login)
    if (!isLoggedIn() && page !== "login") {
        app.innerHTML = Login();
        initLogin(() => loadPage("dashboard"));
        return;
    }

    switch (page) {
        case "login":
            app.innerHTML = Login();
            initLogin(() => loadPage("dashboard"));
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

        default:
            app.innerHTML = "<h2>Halaman tidak ditemukan</h2>";
    }
}