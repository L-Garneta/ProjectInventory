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

      <div class="top-bar">
        <button id="btn-add" class="btn-primary-main">
          + Tambah
        </button>
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
    const kode = document.getElementById("search-kode")?.value.toLowerCase();
    const kategori = document.getElementById("filter-kategori")?.value;

    if (dari) data = data.filter((t) => new Date(t.tanggal) >= new Date(dari));

    if (sampai)
      data = data.filter((t) => new Date(t.tanggal) <= new Date(sampai));

    if (kode) {
      data = data.filter((t) => t.kode.toLowerCase().includes(kode));
    }

    if (kategori) {
      data = data.filter((t) => t.kategori === kategori);
    }
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
        <td>${new Date(trx.tanggal).toLocaleDateString("id-ID")}</td>
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

  // Hapus
  tbody.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Hapus data ini?")) {
        await deleteTransaksiKeluar(Number(btn.dataset.id));
        renderTable();
      }
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
