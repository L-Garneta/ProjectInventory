export function Navbar() {
  return `
    <div class="sidebar">
      <div class="sidebar-brand">Inventory</div>

      <ul class="sidebar-menu">
        <li><a data-page="dashboard" class="nav-link active">Dashboard</a></li>
        <li><a data-page="master-barang" class="nav-link">Master Barang</a></li>
        <li><a data-page="transaksi-masuk" class="nav-link">Transaksi Masuk</a></li>
        <li><a data-page="transaksi-keluar" class="nav-link">Transaksi Keluar</a></li>
        <li><a data-page="laporan" class="nav-link">Laporan</a></li>
        <li><a data-page="logout" class="nav-link danger">Logout</a></li>
      </ul>
    </div>
  `;
}

export function initNavbar(onNavigate) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const page = link.dataset.page;

      if (page === "logout") {
        localStorage.removeItem("isLoggedIn");
        onNavigate("login");
        return;
      }

      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));

      link.classList.add("active");

      onNavigate(page);
    });
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    onNavigate("login");
  });
}
