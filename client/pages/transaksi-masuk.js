import {
  getItems,
  getTransaksiMasuk,
  addTransaksiMasuk,
  deleteTransaksiMasuk,
} from "../services/api.js";

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

      <div id="modal-add" class="modal hidden">
        <div class="modal-content">
          <h3>Tambah Transaksi Masuk</h3>
          <form id="form-add">
            <input id="kode" placeholder="Kode barang"/>
            <input id="nama-barang" placeholder="Nama barang"/>
            <input id="jumlah" type="number" min="1" required />
            <input id="supplier" placeholder="Supplier"/>
            <input id="penerima" placeholder="Penerima"/>
            <input id="keterangan" placeholder="Keterangan"/>

            <button type="submit">Simpan</button>
            <button type="button" id="btn-cancel">Batal</button>
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

  document
    .getElementById("form-add")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        kode: document.getElementById("kode").value,
        jumlah: Number(document.getElementById("jumlah").value),
        supplier: document.getElementById("supplier").value,
        penerima: document.getElementById("penerima").value,
        keterangan: document.getElementById("keterangan").value,
      };

      if (!payload.kode || payload.jumlah <= 0) {
        alert("Isi data dengan benar");
        return;
      }

      await addTransaksiMasuk(payload);

      closeModal();
      e.target.reset();
      renderTable();

      alert("Transaksi berhasil");
    });
}

async function renderTable() {
  const data = await getTransaksiMasuk();
  const tbody = document.getElementById("transaksi-masuk-tbody");

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="10">Belum ada transaksi</td></tr>`;
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
          <button data-id="${trx.id}">Hapus</button>
        </td>
      </tr>
    `
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

function openAdd() {
  toggleModal(true);
}

function closeModal() {
  toggleModal(false);
}

function toggleModal(show) {
  document
    .getElementById("modal-add")
    .classList.toggle("hidden", !show);
}