import { getDashboardData } from "../services/api.js";
import { getStokClass } from "../utils/helper.js";

export function Dashboard() {
  return `
    <div class="dashboard">
      <div class="stats-grid">
        <div class="stat-card">
          <h4>Total Barang</h4>
          <div class="stat-value" id="total-barang">0</div>
        </div>

        <div class="stat-card">
          <h4>Barang Kritis</h4>
          <div class="stat-value" id="barang-kritis">0</div>
        </div>

        <div class="stat-card">
          <h4>Barang Masuk (Bulan Ini)</h4>
          <div class="stat-value" id="total-masuk">0</div>
          <div class="stat-label" id="bulan-info"></div>
        </div>

        <div class="stat-card">
          <h4>Barang Keluar (Bulan Ini)</h4>
          <div class="stat-value" id="total-keluar">0</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Barang Kritis</h3>
        </div>
        <div class="card-body">
          <table class="table">
            <thead>
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

    document.getElementById("total-barang").textContent = data.totalBarang ?? 0;

    document.getElementById("barang-kritis").textContent =
      data.barangKritis ?? 0;

    document.getElementById("total-masuk").textContent =
      data.totalMasukBulan ?? 0;

    document.getElementById("total-keluar").textContent =
      data.totalKeluarBulan ?? 0;

    document.getElementById("bulan-info").textContent = data.bulan ?? "";

    const el = document.getElementById("total-barang");
    if (!el) return;

    const tbody = document.getElementById("kritis-list");

    if (data.barangKritisList?.length) {
      tbody.innerHTML = data.barangKritisList
        .map(
          (item) => `
          <tr>
            <td>${item.kode}</td>
            <td>${item.nama}</td>
            <td class="${getStokClass(item.stok, item.stok_minimum)}">${item.stok}</td>
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
    document.getElementById("kritis-list").innerHTML = `
      <tr>
        <td colspan="4" class="text-center">Gagal memuat data</td>
      </tr>
    `;
  }
}
