import { getItems, addItem, updateItem, deleteItem } from "../services/api.js";

let editKode = null;
let modal;

export function MasterBarang() {
  return `
    <div class="page">
      <h1 class="page-title">Master Barang</h1>

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

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="card card-soft shadow-sm">

    <table class="table table-striped table-hover align-middle">
      
      <thead class="table-light">
            <tr>
              <th>Kode Barang</th>
              <th>Nama Barang</th>
              <th>Kategori</th>
              <th>Ruangan</th>
              <th>Stok</th>
              <th>Min Stok</th>
              <th>Satuan</th>
              <th width="120">Aksi</th>
            </tr>
          </thead>
          <tbody id="master-barang-tbody"></tbody>
        </table>
      </div>

    </div>
  </div>

  <!-- MODAL -->
  <div class="modal fade" id="modal-form">
    <div class="modal-dialog">
      <div class="modal-content">

      <h5 class="modal-title" id="modal-title">Form Barang</h5>

        <div class="modal-header">
          <h5 class="modal-title">Form Barang</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <form id="form-barang">

            <div class="mb-3">
              <label class="form-label">Kode</label>
              <input id="kode" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Nama</label>
              <input id="nama" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Kategori</label>
              <input id="kategori" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Ruangan</label>
              <input id="ruangan" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Stok</label>
              <input id="stok" type="number" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Stok Minimum</label>
              <input id="stok_minimum" type="number" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Satuan</label>
              <input id="satuan" class="form-control" />
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="submit" class="btn btn-success">
                Simpan
              </button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Batal
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  </div>

</div>
  `;
}

export function initMasterBarang() {
  modal = new bootstrap.Modal(document.getElementById("modal-form"));

  renderTable();

  // tombol tambah
  document.getElementById("btn-add").addEventListener("click", () => {
    editKode = null;
    document.getElementById("form-barang").reset();
    document.getElementById("kode").disabled = false;
    document.getElementById("modal-title").textContent = "Tambah Barang";
    modal.show();
  });

  // submit form
  document
    .getElementById("form-barang")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const item = {
        kode: document.getElementById("kode").value.trim(),
        nama: document.getElementById("nama").value.trim(),
        kategori: document.getElementById("kategori").value.trim(),
        ruangan: document.getElementById("ruangan").value.trim(),
        satuan: document.getElementById("satuan").value.trim(),
        stok: Number(document.getElementById("stok").value || 0),
        stok_minimum: Number(
          document.getElementById("stok_minimum").value || 0,
        ),
        harga_beli: 0,
        harga_jual: 0,
      };

      // VALIDASI DULU
      if (!item.kode || !item.nama) {
        alert("Kode dan Nama wajib diisi");
        return;
      }

      try {
        if (editKode) {
          await updateItem(editKode, item);
        } else {
          await addItem(item);
        }

        alert("Data berhasil disimpan");
        modal.hide();
        e.target.reset();
        await renderTable();
      } catch (e) {
        alert("Kode sudah dipakai!");
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
  const tbody = document.getElementById("master-barang-tbody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="8">Loading...</td></tr>`;

  const items = await getItems();

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8">Belum ada data</td></tr>`;
    return;
  }

  tbody.innerHTML = items
    .map(
      (item) => `
    <tr>
      <td>${item.kode}</td>
      <td>${item.nama}</td>
      <td>${item.kategori || "-"}</td>
      <td>${item.ruangan || "-"}</td>
      <td class="${item.stok <= item.stok_minimum ? "text-danger fw-bold" : ""}">
        ${item.stok}
      </td>
      <td>${item.stok_minimum}</td>
      <td>${item.satuan || "-"}</td>
      <td>
        <button class="btn btn-warning btn-sm" data-edit="${item.id}">
          Edit
        </button>
        <button class="btn btn-danger btn-sm" data-delete="${item.id}">
          Hapus
        </button>
      </td>
    </tr>
  `,
    )
    .join("");

  tbody.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.delete);
      if (confirm(`Hapus barang ${id}?`)) {
        await deleteItem(id);
        await renderTable();
      }
    });
  });

  tbody.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.edit);
      await openEdit(id);
    });
  });
}

async function openEdit(id) {
  const items = await getItems();
  const item = items.find((i) => i.id === id);
  if (!item) return;

  editKode = id;

  document.getElementById("modal-title").textContent = "Edit Barang";
  document.getElementById("kode").value = item.kode;
  document.getElementById("nama").value = item.nama;
  document.getElementById("kategori").value = item.kategori || "";
  document.getElementById("ruangan").value = item.ruangan || "";
  document.getElementById("satuan").value = item.satuan || "";
  document.getElementById("stok").value = item.stok;
  document.getElementById("stok_minimum").value = item.stok_minimum;

  document.getElementById("kode").disabled = true;

  modal.show();
}
