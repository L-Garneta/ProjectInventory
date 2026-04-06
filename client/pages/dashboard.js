import { getDashboardData } from "../services/api.js";
import { getStokClass } from "../utils/helper.js";

export function Dashboard() {
  return `
    <div class="dashboard">
      <div class="row g-3 mb-4">

        <div class="col-md-3">
          <div class="card card-gradient p-3 shadow-sm">
            <h6>Total Barang</h6>
            <h3 id="total-barang">0</h3>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card card-gradient p-3 shadow-sm">
            <h6>Barang Kritis</h6>
            <h3 id="barang-kritis">0</h3>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card card-gradient p-3 shadow-sm">
            <h6>Barang Masuk</h6>
            <h3 id="total-masuk">0</h3>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card card-gradient p-3 shadow-sm">
            <h6>Barang Keluar</h6>
            <h3 id="total-keluar">0</h3>
          </div>
        </div>

      </div>

      <div class="card card-soft shadow-sm">
        <div class="card-body">
          <small id="bulan-info" class="text-muted"></small>

          <table class="table table-striped table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Stok</th>
                <th>Min Stok</th>
              </tr>
            </thead>

            <tbody id="kritis-list">
              <tr>
                <td colspan="4" class="text-center">Memuat data...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export async function initDashboard() {
  try {
    const data = await getDashboardData();

    const totalBarangEl = document.getElementById("total-barang");
    const barangKritisEl = document.getElementById("barang-kritis");
    const masukEl = document.getElementById("total-masuk");
    const keluarEl = document.getElementById("total-keluar");
    const bulanEl = document.getElementById("bulan-info");
    const tbody = document.getElementById("kritis-list");

    // ❗ kalau bukan halaman dashboard → stop
    if (!totalBarangEl || !tbody) return;

    totalBarangEl.textContent = data.totalBarang ?? 0;
    barangKritisEl.textContent = data.barangKritis ?? 0;
    masukEl.textContent = data.totalMasukBulan ?? 0;
    keluarEl.textContent = data.totalKeluarBulan ?? 0;
    bulanEl.textContent = data.bulan ?? "";

    if (data.barangKritisList?.length) {
      tbody.innerHTML = data.barangKritisList
        .map(
          (item) => `
          <tr>
            <td>${item.kode}</td>
            <td>${item.nama}</td>
            <td class="${item.stok <= item.stok_minimum ? "text-danger fw-bold" : ""}">
              ${item.stok}
            </td>
            <td>${item.stok_minimum}</td>
          </tr>
        `,
        )
        .join("");
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">Tidak ada barang kritis</td>
        </tr>
      `;
    }
  } catch (e) {
    console.error(e);

    const tbody = document.getElementById("kritis-list");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-danger">Gagal memuat data</td>
        </tr>
      `;
    }
  }
}
