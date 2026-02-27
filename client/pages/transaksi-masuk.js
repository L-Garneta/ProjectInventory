// client/pages/transaksi-masuk.js
import {
  getItems,
  getTransaksiMasuk,
  addTransaksiMasuk,
  deleteTransaksiMasuk,
} from "../services/data-store.js";

let editId = null;

export function TransaksiMasuk() {
  return `
    <div class="page">
      <div class="page-header">
        <h2>Transaksi Masuk</h2>
        <button id="btn-add" class="btn-primary">+ Tambah Transaksi</button>
      </div>

      <div class="card">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
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

      <!-- Modal -->
      <div id="modal-add" class="modal hidden">
        <div class="modal-content">
          <h3>Tambah Transaksi Masuk</h3>
          <form id="form-add">
            
            <div class="form-group">
              <label>Kode Barang</label>
             <input id="kode" />
            </div>

            <div class="form-group">
              <label>Nama Barang</label>
             <input id="nama-barang" />
            </div>

            <div class="form-group">
              <label>Jumlah</label>
              <input id="jumlah" type="number" min="1" required />
            </div>

            <div class="form-group">
              <label>Supplier</label>
              <input id="supplier" />
            </div>

            <div class="form-group">
              <label>Penerima</label>
              <input id="penerima" />
            </div>

            <div class="form-group">
              <label>Keterangan</label>
              <input id="keterangan" />
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

export function initTransaksiMasuk() {
  renderTable();

  document.getElementById("btn-add").addEventListener("click", openAdd);
  document.getElementById("btn-cancel").addEventListener("click", closeModal);

  document.getElementById("form-add").addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      kode: document.getElementById("kode").value,
      jumlah: Number(document.getElementById("jumlah").value),
      supplier: document.getElementById("supplier").value,
      penerima: document.getElementById("penerima").value,
      keterangan: document.getElementById("keterangan").value,
    };

    if (!payload.kode || payload.jumlah <= 0) {
      alert("Pilih barang dan isi jumlah dengan benar");
      return;
    }

    addTransaksiMasuk(payload);

    closeModal();
    e.target.reset();
    renderTable();

    alert("Transaksi berhasil disimpan");
  });
}

function renderTable() {
  const data = getTransaksiMasuk();
  const tbody = document.getElementById("transaksi-masuk-tbody");

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center">Belum ada transaksi</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map(
      (trx, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${trx.tanggal}</td>
        <td>${trx.kode}</td>
        <td>${trx.nama}</td>
        <td>${trx.jumlah}</td>
        <td>${trx.supplier || "-"}</td>
        <td>${trx.penerima || "-"}</td>
        <td>${trx.ruangan || "-"}</td>
        <td>${trx.keterangan || "-"}</td>
        <td>
          <button class="btn-sm btn-danger" data-delete="${trx.id}">
            Hapus
          </button>
        </td>
      </tr>
    `,
    )
    .join("");

  tbody.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.delete);
      if (confirm("Hapus transaksi ini?")) {
        deleteTransaksiMasuk(id);
        renderTable();
      }
    });
  });
}

function openAdd() {
  toggleModal(true);
}

function closeModal() {
  toggleModal(false);
}

function toggleModal(show) {
  const modal = document.getElementById("modal-add");
  modal.classList.toggle("hidden", !show);
}
