import { callApi } from "../services/api.js";
// import { showToast } from "../utils/ui.js";
import { getStokClass } from "../utils/helper.js";

export function Dashboard() {
    return `
    <div class="dashboard">
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon primary">
                    <i class="fas fa-boxes"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Barang</h3>
                    <div class="stat-value" id="total-barang">0</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon warning">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="stat-info">
                    <h3>Barang Kritis</h3>
                    <div class="stat-value" id="barang-kritis">0</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon secondary">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <div class="stat-info">
                    <h3>Barang Masuk</h3>
                    <div class="stat-value" id="total-masuk">0</div>
                    <div class="stat-label" id="bulan-info"></div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon danger">
                    <i class="fas fa-arrow-up"></i>
                </div>
                <div class="stat-info">
                    <h3>Barang Keluar</h3>
                    <div class="stat-value" id="total-keluar">0</div>
                    <div class="stat-label" id="bulan-info"></div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2><i class="fas fa-exclamation-circle"></i> Barang Kritis</h2>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table>
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
                                <td colspan="4" class="text-center">
                                    Tidak ada barang kritis
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  `;
}

// INIT FUNCTION

export async function initDashboard() {
    try {
        const data = await callApi("getDashboardData");

        if (data.success) {
            renderDashboard(data.data);
        } else {
            showToast(data.message, "error");
        }
    } catch (error) {
        showToast("Error loading dashboard", "error");
    }
}

// RENDER FUNCTION

function renderDashboard(data) {
    document.getElementById("total-barang").textContent =
        data.totalBarang || 0;

    document.getElementById("barang-kritis").textContent =
        data.barangKritis || 0;

    document.getElementById("total-masuk").textContent =
        data.totalMasukBulan || 0;

    document.getElementById("total-keluar").textContent =
        data.totalKeluarBulan || 0;

    document.getElementById("bulan-info").textContent =
        data.bulan || "";

    const tbody = document.getElementById("kritis-list");

    if (data.barangKritisList && data.barangKritisList.length > 0) {
        tbody.innerHTML = data.barangKritisList
            .map(
                (item) => `
        <tr>
            <td>${item.kode}</td>
            <td>${item.nama}</td>
            <td class="${getStokClass(item.stok, item.stokMin)}">
                ${item.stok}
            </td>
            <td>${item.stokMin}</td>
        </tr>
      `
            )
            .join("");
    }
}