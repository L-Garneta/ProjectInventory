export function Navbar() {
  return `
    <div class="sidebar p-3 text-white">
      <h4 class="fw-bold mb-4">Inventory</h4>

      <ul class="nav flex-column gap-2">
        <li><a href="#/dashboard" data-page="dashboard" class="nav-link text-white">Dashboard</a></li>
        <li><a href="#/master-barang" data-page="master-barang" class="nav-link text-white">Master Barang</a></li>
        <li><a href="#/purchasing" data-page="purchasing" class="nav-link text-white">Purchasing</a></li>
        <li><a href="#/transaksi-masuk" data-page="transaksi-masuk" class="nav-link text-white">Transaksi Masuk</a></li>
        <li><a href="#/transaksi-keluar" data-page="transaksi-keluar" class="nav-link text-white">Transaksi Keluar</a></li>
        <li><a href="#/laporan" data-page="laporan" class="nav-link text-white">Laporan</a></li>
      </ul>
    </div>
  `;
}

export function initNavbar(onNavigate) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // 🔥 penting

      const page =
        link.dataset.page || link.getAttribute("href").replace("#/", "");

      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));

      link.classList.add("active");

      onNavigate(page);
    });
  });
}
