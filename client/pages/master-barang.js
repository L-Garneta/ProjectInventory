import { getItems, addItem, updateItem, deleteItem } from "../services/api.js";

let editKode = null; // null = mode tambah, selain itu = mode edit

export function MasterBarang() {
  return `
    <div class="page">
      <div class="page-header">
        <h2>Master Barang</h2>
        <button id="btn-add" class="btn-primary">+ Tambah Barang</button>
      </div>

      <div class="card">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th>Kode Barang</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Ruangan</th>
                <th>Satuan</th>
                <th>Stok</th>
                <th>Min Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="master-barang-tbody"></tbody>
          </table>
        </div>
      </div>

      <!-- Modal Tambah/Edit Barang -->
      <div id="modal-add" class="modal hidden">
        <div class="modal-content">
          <h3 id="modal-title">Tambah Barang</h3>
          <form id="form-add">
            <div class="form-group">
              <label>Kode</label>
              <input id="kode" required />
            </div>
            <div class="form-group">
              <label>Nama Barang</label>
              <input id="nama" required />
            </div>
            <div class="form-group">
              <label>Kategori</label>
              <input id="kategori" />
            </div>
            <div class="form-group">
              <label>Ruangan</label>
              <input id="ruangan" />
            </div>
            <div class="form-group">
              <label>Satuan</label>
              <input id="satuan" />
            </div>
            <div class="form-group">
              <label>Stok</label>
              <input id="stok" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>Min Stok</label>
              <input id="stok_minimum" type="number" min="0" />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">Simpan</button>
              <button type="button" id="btn-cancel" class="btn-outline">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initMasterBarang() {
  renderTable();

  document.getElementById("btn-add").addEventListener("click", () => {
    openAdd();
  });

  document.getElementById("btn-cancel").addEventListener("click", () => {
    closeModal();
  });

  document.getElementById("form-add").addEventListener("submit", async (e) => {
    e.preventDefault();

    const item = {
      kode: document.getElementById("kode").value.trim(),
      nama: document.getElementById("nama").value.trim(),
      kategori: document.getElementById("kategori").value.trim(),
      ruangan: document.getElementById("ruangan").value.trim(),
      satuan: document.getElementById("satuan").value.trim(),
      stok: Number(document.getElementById("stok").value || 0),
      stok_minimum: Number(document.getElementById("stok_minimum").value || 0),
    };

    if (!item.kode || !item.nama) {
      alert("Kode dan Nama wajib diisi");
      return;
    }

    if (editKode) {
      // mode edit
      await updateItem(editKode, item);
    } else {
      // mode tambah
      await addItem(item);
    }

    closeModal();
    e.target.reset();
    await renderTable();
  });
}

async function renderTable() {
  const tbody = document.getElementById("master-barang-tbody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="8">Loading...</td></tr>`;

  const items = await getItems();
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">Belum ada data</td></tr>`;
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
      <td>${item.satuan || "-"}</td>
      <td>${item.stok}</td>
      <td>${item.stok_minimum}</td>
      <td>
        <button data-edit="${item.id}">Edit</button>
        <button data-delete="${item.id}">Hapus</button>
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

function openAdd() {
  editKode = null;
  document.getElementById("modal-title").textContent = "Tambah Barang";
  document.getElementById("form-add").reset();
  document.getElementById("kode").disabled = false;
  toggleModal(true);
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

  toggleModal(true);
}

function closeModal() {
  editKode = null;
  toggleModal(false);
}

function toggleModal(show) {
  const modal = document.getElementById("modal-add");
  modal.classList.toggle("hidden", !show);
}
