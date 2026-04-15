// client/pages/laporan.js
import {
  getItems,
  getTransaksiMasuk,
  getTransaksiKeluar,
  getInventaris,
} from "../services/api.js";

export function Laporan() {
  return `
    <div class="page">

      <h2 class="page-title">Laporan</h2>

      <div class="filter-container">
        <select id="filterJenisLaporan">
          <option value="master">Master Barang</option>
          <option value="masuk">Transaksi Masuk</option>
          <option value="keluar">Transaksi Keluar</option>
          <option value="inventaris">Inventaris</option>
        </select>

        <input type="date" id="filterDari">
        <input type="date" id="filterSampai">

        <button id="btn-generate" class="btn-primary">
          Generate Laporan
        </button>

        <button id="btn-excel" class="btn-outline">
          Export Excel
        </button>
      </div>

      <div class="card card-soft shadow-sm">
        <div class="card-body">

          <table id="laporan-table" class="table table-striped">

            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Masuk</th>
                <th>Keluar</th>
                <th>Stok</th>
              </tr>
            </thead>

            <tbody id="laporan-body">
              <tr>
                <td colspan="7" class="text-center text-muted">
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

export function initLaporan() {
  const filterJenis = document.getElementById("filterJenisLaporan");
  const btnGenerate = document.getElementById("btn-generate");
  const btnExcel = document.getElementById("btn-excel");

  btnExcel.addEventListener("click", exportExcel);

  btnGenerate.addEventListener("click", async () => {
    const jenis = filterJenis.value;

    const tbody = document.getElementById("laporan-body");
    tbody.innerHTML = `<tr><td colspan="7">Loading...</td></tr>`;

    if (jenis === "master") {
      await renderMasterBarang();
    } else if (jenis === "masuk") {
      await renderTransaksiMasuk();
    } else if (jenis === "keluar") {
      await renderTransaksiKeluar();
    } else if (jenis === "inventaris") {
      await renderInventaris();
    }
  });

  // =============================
  // MASTER BARANG
  // =============================
  async function renderMasterBarang() {
    const items = await getItems(); // ✅

    const tbody = document.getElementById("laporan-body");

    tbody.innerHTML = items.length
      ? items
          .map(
            (item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>-</td>
          <td>${item.kode}</td>
          <td>${item.nama}</td>
          <td>-</td>
          <td>-</td>
          <td>${item.stok}</td>
        </tr>
      `,
          )
          .join("")
      : `<tr><td colspan="7">Tidak ada data</td></tr>`;
  }

  // =============================
  // TRANSAKSI MASUK
  // =============================
  async function renderTransaksiMasuk() {
    const data = await getTransaksiMasuk(); // ✅

    const tbody = document.getElementById("laporan-body");

    tbody.innerHTML = data.length
      ? data
          .map(
            (trx, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${trx.tanggal}</td>
          <td>${trx.item?.kode ?? "-"}</td>
          <td>${trx.item?.nama ?? "-"}</td>
          <td>${trx.jumlah}</td>
          <td>-</td>
          <td>-</td>
        </tr>
      `,
          )
          .join("")
      : `<tr><td colspan="7">Tidak ada data</td></tr>`;
  }

  // TRANSAKSI KELUAR
  async function renderTransaksiKeluar() {
    const data = await getTransaksiKeluar();

    const tbody = document.getElementById("laporan-body");

    tbody.innerHTML = data.length
      ? data
          .map(
            (trx, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${trx.tanggal}</td>
          <td>${trx.item?.kode ?? "-"}</td>
          <td>${trx.item?.nama ?? "-"}</td>
          <td>-</td>
          <td>${trx.jumlah}</td>
          <td>-</td>
        </tr>
      `,
          )
          .join("")
      : `<tr><td colspan="7">Tidak ada data</td></tr>`;
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

  // INVENTARIS
  async function renderInventaris() {
    const data = await getInventaris();

    const tbody = document.getElementById("laporan-body");

    tbody.innerHTML = data.length
      ? data
          .map(
            (inv, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${formatDate(inv.created_at)}</td>
          <td>${inv.kode_inventaris}</td>
          <td>${inv.item?.nama ?? "-"}</td>
          <td>-</td>
          <td>-</td>
          <td>1</td>
        </tr>
      `,
          )
          .join("")
      : `<tr><td colspan="7">Tidak ada data inventaris</td></tr>`;
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("id-ID");
  }
}
