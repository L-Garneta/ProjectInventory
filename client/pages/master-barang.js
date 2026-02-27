// client/pages/master-barang.js
import { getItems, addItem, updateItem, deleteItem } from "../services/data-store.js";

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
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Ruangan</th>
                <th>Stok</th>
                <th>Min Stok</th>
                <th>Satuan</th>
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
              <label>Stok</label>
              <input id="stok" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>Min Stok</label>
              <input id="stokMin" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>Satuan</label>
              <input id="satuan" placeholder="pcs" />
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

  document.getElementById("form-add").addEventListener("submit", (e) => {
    e.preventDefault();

    const item = {
      kode: document.getElementById("kode").value.trim(),
      nama: document.getElementById("nama").value.trim(),
      kategori: document.getElementById("kategori").value.trim(),
      ruangan: document.getElementById("ruangan").value.trim(),
      stok: Number(document.getElementById("stok").value || 0),
      stokMin: Number(document.getElementById("stokMin").value || 0),
      satuan: document.getElementById("satuan").value.trim() || "pcs",
    };

    if (!item.kode || !item.nama) {
      alert("Kode dan Nama wajib diisi");
      return;
    }

    if (editKode) {
      // mode edit
      updateItem(editKode, item);
    } else {
      // mode tambah
      addItem(item);
    }

    closeModal();
    e.target.reset();
    renderTable();

    alert("Data tersimpan. Cek Dashboard untuk update terbaru.");
  });
}

function renderTable() {
  const items = getItems();
  const tbody = document.getElementById("master-barang-tbody");

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
        <td>${item.stok}</td>
        <td>${item.stokMin}</td>
        <td>${item.satuan || "-"}</td>
        <td>
          <button class="btn-sm btn-outline" data-edit="${item.kode}">Edit✏️</button>
          <button class="btn-sm btn-danger" data-delete="${item.kode}">Hapus</button>
        </td>
      </tr>
    `
    )
    .join("");

  tbody.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kode = btn.dataset.delete;
      if (confirm(`Hapus barang ${kode}?`)) {
        deleteItem(kode);
        renderTable();
      }
    });
  });

  tbody.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kode = btn.dataset.edit;
      openEdit(kode);
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

function openEdit(kode) {
  const item = getItems().find((i) => i.kode === kode);
  if (!item) return;

  editKode = kode;
  document.getElementById("modal-title").textContent = "Edit Barang";
  document.getElementById("kode").value = item.kode;
  document.getElementById("nama").value = item.nama;
  document.getElementById("kategori").value = item.kategori || "";
  document.getElementById("ruangan").value = item.ruangan || "";
  document.getElementById("stok").value = item.stok;
  document.getElementById("stokMin").value = item.stokMin;
  document.getElementById("satuan").value = item.satuan || "pcs";

  // kode jangan bisa diubah saat edit
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