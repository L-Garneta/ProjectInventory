import {
  getItems,
  getTransaksiKeluar,
  addTransaksiKeluar,
  deleteTransaksiKeluar,
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
            <tbody id="trx-body"></tbody>
          </table>
        </div>
      </div>

      <!-- MODAL BOOTSTRAP -->
      <div class="modal fade" id="modalKeluar" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h5 class="modal-title">Tambah Stok Keluar</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="form-keluar">
              <div class="modal-body">

                <div class="mb-3">
                  <label>Barang</label>
                  <select id="item_id" class="form-select" required></select>
                </div>

                <div class="mb-3">
                  <label>Jumlah</label>
                  <input type="number" id="jumlah" class="form-control" required />
                </div>

                <div class="mb-3">
                  <label>Keterangan</label>
                  <input type="text" id="keterangan" class="form-control" />
                </div>

              </div>

              <div class="modal-footer">
                <button type="submit" class="btn btn-success">Simpan</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Batal
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  `;
}

export function initTransaksiKeluar() {
  setTimeout(() => {
    renderTable();
    loadItems();

    const modal = new bootstrap.Modal(document.getElementById("modalKeluar"));

    const tbody = document.getElementById("trx-body");

    // ✅ tombol tambah
    document.getElementById("btn-add").addEventListener("click", () => {
      modal.show();
    });

    // ✅ submit
    document
      .getElementById("form-keluar")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
          await addTransaksiKeluar({
            item_id: document.getElementById("item_id").value,
            jumlah: document.getElementById("jumlah").value,
            keterangan: document.getElementById("keterangan").value,
            tanggal: new Date().toISOString().split("T")[0],
          });

          alert("Transaksi berhasil");
          modal.hide();
          e.target.reset();
          renderTable();
        } catch (err) {
          alert(err.message);
        }
      });

    // ✅ delete
    tbody.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("delete-btn")) return;

      const id = e.target.dataset.id;

      if (!confirm("Hapus data ini?")) return;

      await deleteTransaksiKeluar(id);
      renderTable();
    });

    // filter
    document.getElementById("btn-filter").addEventListener("click", () => {
      renderTable(true);
    });

    document.getElementById("btn-reset").addEventListener("click", () => {
      document.getElementById("filter-dari").value = "";
      document.getElementById("filter-sampai").value = "";
      document.getElementById("search-kode").value = "";
      renderTable();
    });
  }, 0);
}

// =========================
// RENDER TABLE
// =========================
async function renderTable(useFilter = false) {
  let data = await getTransaksiKeluar();
  const tbody = document.getElementById("trx-body");

  if (!tbody) return;

  if (useFilter) {
    const dari = document.getElementById("filter-dari").value;
    const sampai = document.getElementById("filter-sampai").value;
    const kode = document.getElementById("search-kode")?.value.toLowerCase();

    if (dari) {
      data = data.filter((t) => new Date(t.tanggal) >= new Date(dari));
    }

    if (sampai) {
      data = data.filter((t) => new Date(t.tanggal) <= new Date(sampai));
    }

    if (kode) {
      data = data.filter((t) => t.kode.toLowerCase().includes(kode));
    }
  }

  if (!data.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center">
          Tidak ada data
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
          <button class="btn-danger-sm delete-btn" data-id="${trx.id}">
            Hapus
          </button>
        </td>
      </tr>
    `,
    )
    .join("");
}

// =========================
// LOAD ITEMS
// =========================
async function loadItems() {
  const items = await getItems();
  const select = document.getElementById("item_id");
  if (!select) return;

  select.innerHTML = `
    <option value="">Pilih barang</option>
    ${items
      .map(
        (i) => `
        <option value="${i.id}">
          ${i.kode} - ${i.nama} (Stok: ${i.stok})
        </option>
      `,
      )
      .join("")}
  `;
}
