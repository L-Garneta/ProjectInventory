export function TransaksiKeluar() {
  return `
    <div class="page">
      
      <h1 class="page-title">Stok Keluar</h1>

      <div class="action-bar">
        <button class="btn-primary-main">+ Tambah Stok Keluar</button>
        <button class="btn-outline">Hapus Semua</button>
      </div>

      <div class="filter-bar">
        <label>Dari:</label>
        <input type="date" />

        <label>Sampai:</label>
        <input type="date" />

        <button class="btn-primary-sm">Filter</button>
        <button class="btn-outline">Reset</button>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Data Transaksi Keluar</h3>
        </div>

        <div class="card-body">
          <table class="table transaksi-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Penerima</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="8" class="text-center empty-text">
                  Belum ada data
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

export function initTransaksiKeluar() {
  console.log("Halaman Transaksi Keluar aktif");
}