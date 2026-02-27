// client/pages/laporan.js
import { getItems } from "../services/data-store.js";

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

      <div class="card">
        <div class="card-body">
          <table class="table">
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
      renderPlaceholder("Transaksi Masuk");
    } else if (jenis === "keluar") {
      renderPlaceholder("Transaksi Keluar");
    } else if (jenis === "opname") {
      renderPlaceholder("Stok Opname");
    }
  }

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
        <th>Harga</th>
        <th>Stok</th>
      </tr>
    `;

    if (!items.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">Tidak ada data</td>
        </tr>
      `;
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
        <td>Rp ${Number(item.harga || 0).toLocaleString("id-ID")}</td>
        <td>${item.stok}</td>
      </tr>
    `,
      )
      .join("");
  }

  function renderPlaceholder(title) {
    const thead = document.getElementById("laporan-thead");
    const tbody = document.getElementById("laporan-tbody");

    thead.innerHTML = `<tr><th>${title}</th></tr>`;
    tbody.innerHTML = `
      <tr>
        <td class="text-center">
          Data ${title} belum tersedia
        </td>
      </tr>
    `;
  }

  function exportPDF() {
    window.print();
  }

  function exportExcel() {
    const table = document.querySelector(".table");
    let tableHTML = table.outerHTML;

    const blob = new Blob([tableHTML], {
      type: "application/vnd.ms-excel",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "laporan.xls";
    link.click();
  }
}
