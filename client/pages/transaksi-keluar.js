import {
  getItems,
  getTransaksiKeluar,
  addTransaksiKeluar,
  deleteTransaksiKeluar,
  clearTransaksiKeluar,
} from "../services/api.js";

export function TransaksiKeluar() {
  return `
    <div class="page">
      <h1 class="page-title">Stok Keluar</h1>

      <div class="action-bar">
        <button id="btn-add" class="btn-primary-main">+ Tambah Stok Keluar</button>
        <button id="btn-clear" class="btn-outline">Hapus Semua</button>
      </div>

      <div class="filter-bar">
        <label>Dari:</label>
        <input type="date" id="filter-dari" />

        <label>Sampai:</label>
        <input type="date" id="filter-sampai" />

        <button id="btn-filter" class="btn-primary-sm">Filter</button>
        <button id="btn-reset" class="btn-outline">Reset</button>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Data Transaksi Keluar</h3>
        </div>

        <div class="card card-soft shadow-sm">
          <div class="card-body">

            <table class="table table-striped table-hover align-middle">
      
              <thead class="table-light">
                      <tr>
                        <th>No</th>
                        <th>Tanggal</th>
                        <th>Kode</th>
                        <th>Nama Barang</th>
                        <th>Jumlah</th>
                        <th>Unit</th>
                        <th>Keterangan</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
            <tbody id="trx-body">
              <tr>
                <td colspan="8" class="text-center empty-text">
                  Belum ada data
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL TAMBAH -->
      <div id="modal-keluar" class="modal hidden">
        <div class="modal-content">
          <h3>Tambah Stok Keluar</h3>

          <form id="form-keluar" class="form-grid">
            <div class="form-group">
              <label>Barang</label>
              <select id="kode" required>
                <option value="">Pilih barang</option>
  
              </select>
            </div>

            <div class="form-group">
              <label>Jumlah</label>
              <input id="jumlah" type="number" min="1" required />
            </div>

            <div class="form-group">
              <label>Unit</label>
              <input id="unit" />
            </div>

            <div class="form-group">
              <label>Keterangan</label>
              <input id="keterangan" />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary-main">
                Simpan
              </button>
              <button type="button" id="btn-close" class="btn-outline">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initTransaksiKeluar() {
  renderTable();
  loadItems();

  // buka modal
  document.getElementById("btn-add").addEventListener("click", () => {
    toggleModal(true);
  });

  document.getElementById("btn-close").addEventListener("click", () => {
    toggleModal(false);
  });

  // submit transaksi
  document
    .getElementById("form-keluar")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        await addTransaksiKeluar({
          kode: document.getElementById("kode").value,
          jumlah: document.getElementById("jumlah").value,
          unit: document.getElementById("unit").value,
          keterangan: document.getElementById("keterangan").value,
        });

        alert("Transaksi berhasil");
        toggleModal(false);
        e.target.reset();
        renderTable();
      } catch (err) {
        alert(err.message);
      }
    });

  // hapus semua
  document.getElementById("btn-clear").addEventListener("click", async () => {
    if (confirm("Yakin hapus semua transaksi?")) {
      await clearTransaksiKeluar();
      renderTable();
    }
  });

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

async function renderTable(useFilter = false) {
  const tbody = document.getElementById("trx-body");
  let data = await getTransaksiKeluar();

  if (useFilter) {
    const dari = document.getElementById("filter-dari").value;
    const sampai = document.getElementById("filter-sampai").value;

    if (dari) data = data.filter((t) => new Date(t.tanggal) >= new Date(dari));

    if (sampai)
      data = data.filter((t) => new Date(t.tanggal) <= new Date(sampai));
  }

  if (!data.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center empty-text">
          Belum ada data
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data
    .map(
      (trx, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${trx.tanggal}</td>
        <td>${trx.kode}</td>
        <td>${trx.nama}</td>
        <td>${trx.jumlah}</td>
        <td>${trx.unit || "-"}</td>
        <td>${trx.keterangan || "-"}</td>
        <td>
          <button class="btn-danger-sm" data-id="${trx.id}">
            Hapus
          </button>
        </td>
      </tr>
    `,
    )
    .join("");

  tbody.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteTransaksiKeluar(Number(btn.dataset.id));
      renderTable();
    });
  });
}

function toggleModal(show) {
  document.getElementById("modal-keluar").classList.toggle("hidden", !show);
}

async function loadItems() {
  const items = await getItems();
  const select = document.getElementById("kode");
  if (!select) return;

  select.innerHTML = `
    <option value="">Pilih barang</option>
    ${items
      .map(
        (i) => `
      <option value="${i.kode}">
        ${i.kode} - ${i.nama} (Stok: ${i.stok})
      </option>
    `,
      )
      .join("")}
  `;
}
