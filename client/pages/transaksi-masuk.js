import { getItems, addTransaksiMasuk } from "../services/data-store.js";

export function TransaksiMasuk() {
  return `
    <div class="page">
      <h2>Transaksi Masuk</h2>

      <div class="card">
        <div class="card-body">
          <form id="form-masuk" class="form-grid">
            <div class="form-group">
              <label>Barang</label>
              <select id="kode" required>
                <option value="">Pilih barang</option>
                ${getItems()
      .map((i) => `<option value="${i.kode}">${i.kode} - ${i.nama}</option>`)
      .join("")}
              </select>
            </div>

            <div class="form-group">
              <label>Jumlah Masuk</label>
              <input id="jumlah" type="number" min="1" required />
            </div>

            <div class="form-group">
              <label>Keterangan</label>
              <input id="keterangan" placeholder="Opsional" />
            </div>

            <button class="btn-primary" type="submit">Simpan</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initTransaksiMasuk() {
  const form = document.getElementById("form-masuk");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      kode: document.getElementById("kode").value,
      jumlah: Number(document.getElementById("jumlah").value),
      keterangan: document.getElementById("keterangan").value,
    };

    if (!payload.kode || payload.jumlah <= 0) {
      alert("Pilih barang dan isi jumlah dengan benar");
      return;
    }

    addTransaksiMasuk(payload);
    alert("Transaksi masuk berhasil");

    form.reset();
  });
}