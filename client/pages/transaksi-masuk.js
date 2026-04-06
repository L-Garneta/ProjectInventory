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

      <div id="modal-add" class="modal hidden">
        <div class="modal-content">
          <h3>Tambah Transaksi Masuk</h3>
          <form id="form-add">
            <select id="item_id" required></select>
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
  const tbody = document.getElementById("transaksi-masuk-tbody");
  const btnAdd = document.getElementById("btn-add");
  const btnCancel = document.getElementById("btn-cancel");
  const form = document.getElementById("form-add");

  // 💥 STOP kalau DOM belum siap
  if (!tbody || !btnAdd || !btnCancel || !form) {
    console.warn("DOM transaksi masuk belum siap");
    return;
  }

  // ✅ baru jalanin
  renderTable();
  loadItems();

  btnAdd.addEventListener("click", openAdd);
  btnCancel.addEventListener("click", closeModal);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      item_id: Number(document.getElementById("item_id").value),
      jumlah: Number(document.getElementById("jumlah").value),
      supplier: document.getElementById("supplier").value,
      penerima: document.getElementById("penerima").value,
      keterangan: document.getElementById("keterangan").value,
    };

    if (!payload.item_id || payload.jumlah <= 0) {
      alert("Isi data dengan benar");
      return;
    }

    await addTransaksiMasuk(payload);

    closeModal();
    e.target.reset();

    renderTable(); // refresh data

    alert("Transaksi berhasil");
  });
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

function openAdd() {
  toggleModal(true);
}

function closeModal() {
  toggleModal(false);
}

function toggleModal(show) {
  document.getElementById("modal-add").classList.toggle("hidden", !show);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID");
}
