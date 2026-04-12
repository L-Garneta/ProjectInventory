import {
  getItems,
  getPurchasing,
  addPurchasing,
  updatePurchasing,
  deletePurchasing,
} from "../services/api.js";

export function Purchasing() {
  return `
    <div class="page">
      <h1 class="page-title">Purchasing</h1>

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
                    <th>Barang</th>
                    <th>Jumlah</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
        <tbody id="purchasing-body"></tbody>
        </table>
        </div>
    </div>

      <!-- MODAL -->
      <div class="modal fade" id="modalForm" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h5 class="modal-title">Tambah Purchasing</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="form-purchasing">
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
                  <label>Supplier</label>
                  <input type="text" id="supplier" class="form-control" />
                </div>

                <div class="mb-3">
                  <label>Tanggal</label>
                  <input type="date" id="tanggal" class="form-control" required />
                </div>

              </div>

              <div class="modal-footer">
                <button type="submit" class="btn btn-success">Simpan</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
              </div>
            </form>

          </div>
        </div>
      </div>

    </div>
  `;
}

export function initPurchasing() {
  setTimeout(() => {
    renderTable();
    loadItems();

    const tbody = document.getElementById("purchasing-body");
    if (!tbody) return;

    // ✅ EVENT DELETE (PINDAH KE SINI)
    tbody.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("delete-btn")) return;

      const id = e.target.dataset.id;

      if (!confirm("Yakin mau hapus?")) return;

      await deletePurchasing(id);
      renderTable();
    });
  }, 0);

  const modal = new bootstrap.Modal(document.getElementById("modalForm"));

  document.getElementById("btn-add").addEventListener("click", () => {
    modal.show();
  });

  document
    .getElementById("form-purchasing")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        await addPurchasing({
          item_id: document.getElementById("item_id").value,
          jumlah: document.getElementById("jumlah").value,
          supplier: document.getElementById("supplier").value,
          tanggal_pesan: document.getElementById("tanggal").value,
        });

        alert("Purchasing berhasil dibuat");
        modal.hide();
        e.target.reset();
        renderTable();
      } catch (e) {
        alert(e.message);
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

async function renderTable() {
  const data = await getPurchasing();
  const tbody = document.getElementById("purchasing-body");

  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Tidak ada data</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map(
      (p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${formatDate(p.tanggal_pesan)}</td>
        <td>${p.item?.kode} - ${p.item?.nama}</td>
        <td>${p.jumlah}</td>
        <td>${p.supplier || "-"}</td>
        <td>
          <select class="form-select form-select-sm status-select" data-id="${p.id}">
            ${statusOption(p.status)}
          </select>
        </td>
        <td>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${p.id}">
                Hapus 🗑
            </button>
        </td>
      </tr>
    `,
    )
    .join("");

  // 🔥 EVENT UPDATE STATUS
  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", async () => {
      const id = select.dataset.id;
      const p = data.find((item) => item.id == id);

      if (!p) return alert("Data tidak ditemukan!");

      await updatePurchasing(id, {
        status: select.value,
        jumlah: p.jumlah,
        supplier: p.supplier,
      });

      renderTable();
    });
  });
}

async function loadItems() {
  const items = await getItems();
  const select = document.getElementById("item_id");
  if (!select) return;

  select.innerHTML = `
    <option value="">Pilih barang</option>
    ${items
      .map(
        (i) =>
          `<option value="${i.id}">
            ${i.kode} - ${i.nama} (Stok: ${i.stok})
          </option>`,
      )
      .join("")}
  `;
}

function statusOption(current) {
  const list = ["dipesan", "dikirim", "sampai"];

  return list
    .map(
      (s) =>
        `<option value="${s}" ${s === current ? "selected" : ""}>
          ${s}
        </option>`,
    )
    .join("");
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID");
}
