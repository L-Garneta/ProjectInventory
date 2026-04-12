import {
  getItems,
  getTransaksiMasuk,
  deleteTransaksiMasuk,
} from "../services/api.js";

export function TransaksiMasuk() {
  return `
    <div class="page">
      <div class="page-header">
        <h2>Transaksi Masuk</h2>
      </div>

      <div class="filter-bar-modern">

        <input type="date" id="filter-dari" />
        <input type="date" id="filter-sampai" />

        <input type="text" id="search-kode" placeholder="Cari kode..." />

        <select id="filter-kategori">
          <option value="">Semua kategori</option>
        </select>

        <button id="btn-filter" class="btn-primary-sm">Filter</button>
        <button id="btn-reset" class="btn-outline">Reset</button>
      </div>

      <div class="card card-soft shadow-sm">
        <div class="card-body">

          <table class="table table-striped table-hover align-middle">
      
            <thead class="table-light">
              <tr>
                <th>No</th>
                <th>Tanggal Masuk</th>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Supplier</th>
                <th>Penerima</th>
                <th>Ruangan</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="transaksi-masuk-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function initTransaksiMasuk() {
  const tbody = document.getElementById("transaksi-masuk-tbody");

  // ✅ baru jalanin
  renderTable();
  loadItems();
}

async function loadItems() {
  const select = document.getElementById("item_id");
  if (!select) return;

  const items = await getItems();

  select.innerHTML = `
    <option value="">Pilih Barang</option>
    ${items
      .map(
        (item) =>
          `<option value="${item.id}">
            ${item.kode} - ${item.nama}
          </option>`,
      )
      .join("")}
  `;

  // filter
  document.getElementById("btn-filter").addEventListener("click", () => {
    renderTable(true);
  });

  document.getElementById("btn-reset").addEventListener("click", () => {
    document.getElementById("filter-dari").value = "";
    document.getElementById("filter-sampai").value = "";
    renderTable();
  });
}

async function renderTable() {
  const tbody = document.getElementById("transaksi-masuk-tbody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="10">Loading...</td></tr>`;

  let data = []; // 🔥 pindahin ke luar

  try {
    data = await getTransaksiMasuk();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="10">Gagal load data</td></tr>`;
    return; // 🔥 STOP di sini
  }

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="10">Belum ada transaksi</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map(
      (trx, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${trx.tanggal ? formatDate(trx.tanggal) : "-"}</td>
        <td>${trx.item?.kode ?? "-"}</td>
        <td>${trx.item?.nama ?? "-"}</td>
        <td>${trx.jumlah}</td>
        <td>${trx.supplier || "-"}</td>
        <td>${trx.penerima || "-"}</td>
        <td>${trx.ruangan || "-"}</td>
        <td>
          <span class="badge bg-secondary">
            ${trx.keterangan || "-"}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-danger" data-id="${trx.id}">
            🗑 Hapus
          </button>
        </td>
      </tr>
    `,
    )
    .join("");

  tbody.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Hapus?")) {
        await deleteTransaksiMasuk(Number(btn.dataset.id));
        renderTable();
      }
    });
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID");
}
