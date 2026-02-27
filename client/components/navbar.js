export function Navbar() {
  return `
    <nav class="navbar">
    <div class="navbar-container">
      <div class="nav-brand">Inventory</div>
      <ul class="nav-menu">
        <li><a href="#" data-page="dashboard" class="nav-link active">Dashboard</a></li>
        <li><a href="#" data-page="master-barang" class="nav-link">Master Barang</a></li>
        <li><a href="#" data-page="transaksi-masuk" class="nav-link">Transaksi Masuk</a></li>
        <li><a href="#" data-page="transaksi-keluar" class="nav-link">Transaksi Keluar</a></li>
        <li><a href="#" data-page="laporan" class="nav-link">Laporan</a></li>
        <li><a href="#" id="logoutBtn" class="nav-link danger">Logout</a></li>
      </ul>
    </nav>
  `;
}

export function initNavbar(onNavigate) {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;

      // active state
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      onNavigate(page);
    });
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      onNavigate("login");
    });
  }
}
