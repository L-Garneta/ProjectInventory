// client/pages/laporan.js
import {
  getItems,
  getTransaksiMasuk,
  getTransaksiKeluar,
} from "../services/data-store.js";

export function Laporan() {
  return `
    <div class="page">

      <h2 class="page-title">Laporan</h2>

      <div class="filter-container">
        <select id="filterJenisLaporan">
          <option value="master">Master Barang</option>
          <option value="masuk">Transaksi Masuk</option>
          <option value="keluar">Transaksi Keluar</option>
          <option value="opname">Stok Opname</option>
        </select>

        <input type="date" id="filterDari">
        <input type="date" id="filterSampai">

        <button id="btn-generate" class="btn-primary">
          Generate Laporan
        </button>

        <button id="btn-pdf" class="btn-outline">
          Export PDF
        </button>

        <button id="btn-excel" class="btn-outline">
          Export Excel
        </button>
      </div>

      <div class="card" id="laporan-area">
        <div class="card-body">
          <table class="table" id="laporan-table">
            <thead id="laporan-thead"></thead>
            <tbody id="laporan-tbody"></tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

export function initLaporan() {
  const filterJenis = document.getElementById("filterJenisLaporan");
  const btnGenerate = document.getElementById("btn-generate");
  const btnPDF = document.getElementById("btn-pdf");
  const btnExcel = document.getElementById("btn-excel");

  btnGenerate.addEventListener("click", generateLaporan);
  btnPDF.addEventListener("click", exportPDF);
  btnExcel.addEventListener("click", exportExcel);

  function generateLaporan() {
    const jenis = filterJenis.value;

    if (jenis === "master") {
      renderMasterBarang();
    } else if (jenis === "masuk") {
      renderTransaksiMasuk();
    } else if (jenis === "keluar") {
      renderTransaksiKeluar();
    } else if (jenis === "opname") {
      renderStokOpname();
    }
  }

  // =============================
  // MASTER BARANG
  // =============================
  function renderMasterBarang() {
    const items = getItems();
    const thead = document.getElementById("laporan-thead");
    const tbody = document.getElementById("laporan-tbody");

    thead.innerHTML = `
      <tr>
        <th>Kode</th>
        <th>Nama</th>
        <th>Kategori</th>
        <th>Ruangan</th>
        <th>Stok</th>
      </tr>
    `;

    tbody.innerHTML = items.length
      ? items
          .map(
            (item) => `
        <tr>
          <td>${item.kode}</td>
          <td>${item.nama}</td>
          <td>${item.kategori || "-"}</td>
          <td>${item.ruangan || "-"}</td>
          <td>${item.stok}</td>
        </tr>
      `,
          )
          .join("")
      : `<tr><td colspan="5" class="text-center">Tidak ada data</td></tr>`;
  }

  // =============================
  // TRANSAKSI MASUK
  // =============================
  function renderTransaksiMasuk() {
    const data = filterByTanggal(getTransaksiMasuk());
    renderTransaksiTable(data, "Transaksi Masuk");
  }

  // =============================
  // TRANSAKSI KELUAR
  // =============================
  function renderTransaksiKeluar() {
    const data = filterByTanggal(getTransaksiKeluar());
    renderTransaksiTable(data, "Transaksi Keluar");
  }

  function renderTransaksiTable(data, title) {
    const thead = document.getElementById("laporan-thead");
    const tbody = document.getElementById("laporan-tbody");

    thead.innerHTML = `
      <tr>
        <th>Tanggal</th>
        <th>Kode</th>
        <th>Nama</th>
        <th>Jumlah</th>
      </tr>
    `;

    tbody.innerHTML = data.length
      ? data
          .map(
            (trx) => `
        <tr>
          <td>${trx.tanggal}</td>
          <td>${trx.kode}</td>
          <td>${trx.nama}</td>
          <td>${trx.jumlah}</td>
        </tr>
      `,
          )
          .join("")
      : `<tr><td colspan="4" class="text-center">Tidak ada data ${title}</td></tr>`;
  }

  // =============================
  // STOK OPNAME
  // =============================
  function renderStokOpname() {
    const items = getItems();
    const thead = document.getElementById("laporan-thead");
    const tbody = document.getElementById("laporan-tbody");

    thead.innerHTML = `
      <tr>
        <th>Kode</th>
        <th>Nama</th>
        <th>Stok</th>
        <th>Min Stok</th>
        <th>Status</th>
      </tr>
    `;

    tbody.innerHTML = items
      .map(
        (item) => `
      <tr>
        <td>${item.kode}</td>
        <td>${item.nama}</td>
        <td>${item.stok}</td>
        <td>${item.stokMin}</td>
        <td>${item.stok <= item.stokMin ? "Perlu Restock" : "Aman"}</td>
      </tr>
    `,
      )
      .join("");
  }

  // =============================
  // FILTER TANGGAL
  // =============================
  function filterByTanggal(data) {
    const dari = document.getElementById("filterDari").value;
    const sampai = document.getElementById("filterSampai").value;

    if (!dari && !sampai) return data;

    return data.filter((trx) => {
      const tgl = new Date(trx.tanggal.split("/").reverse().join("-"));
      const from = dari ? new Date(dari) : null;
      const to = sampai ? new Date(sampai) : null;

      if (from && tgl < from) return false;
      if (to && tgl > to) return false;
      return true;
    });
  }

  // =============================
  // EXPORT PDF (HANYA TABEL)
  // =============================
  function exportPDF() {
    const tableHTML = document.getElementById("laporan-area").innerHTML;
    const newWin = window.open("", "", "width=900,height=700");
    newWin.document.write(`
      <html>
        <head>
          <title>Laporan</title>
          <style>
            body { font-family: Arial; padding:20px; }
            table { width:100%; border-collapse: collapse; }
            th, td { border:1px solid #000; padding:8px; text-align:left; }
            th { background:#f2f2f2; }
          </style>
        </head>
        <body>
          <h3>Laporan</h3>
          ${tableHTML}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.print();
  }

  // =============================
  // EXPORT EXCEL
  // =============================
  function exportExcel() {
    const table = document.getElementById("laporan-table");
    const blob = new Blob([table.outerHTML], {
      type: "application/vnd.ms-excel",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "laporan.xls";
    link.click();
  }
}
