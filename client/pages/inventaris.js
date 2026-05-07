import {
  getInventarisPending,
  generateInventaris,
  getInventaris,
  updateInventaris,
} from "../services/api.js";
import { isAdmin } from "../auth.js";

export function Inventaris() {
  const admin = isAdmin();

  return `
    <div class="page">
      <div class="page-header">
        <h2>Inventaris</h2>
      </div>

      <div class="mb-3">
        ${admin ? `<button class="btn btn-primary btn-sm" id="tab-pending">Pending</button>` : ""}
        <button class="btn ${admin ? "btn-outline-primary" : "btn-primary"} btn-sm" id="tab-data">Data Inventaris</button>
      </div>

      <div id="inventaris-content"></div>
    </div>

    ${
      admin
        ? `
    <!-- Modal Generate (Admin Only) -->
    <div id="modal-inventaris" class="modal" style="display:none;">
      <div class="modal-content">
        <h4>Generate Inventaris</h4>
        <label>Kode Barang</label>
        <input id="modal-kode" readonly />
        <label>Ruangan</label>
        <input id="modal-ruangan" placeholder="Masukkan ruangan" />
        <label>Preview Kode</label>
        <input id="modal-preview" readonly />
        <br/>
        <button id="btn-save-inventaris">💾 Simpan</button>
        <button id="btn-close-modal">❌ Batal</button>
      </div>
    </div>
    `
        : ""
    }

    <div id="toast" class="toast"></div>
  `;
}

export function initInventaris() {
  const admin = isAdmin();

  // Staff langsung lihat data inventaris, admin mulai dari pending
  if (admin) {
    loadPending();
    document.getElementById("tab-pending").addEventListener("click", () => {
      setActiveTab("pending");
      loadPending();
    });
  } else {
    loadDataInventaris();
  }

  document.getElementById("tab-data").addEventListener("click", () => {
    setActiveTab("data");
    loadDataInventaris();
  });
}

function setActiveTab(active) {
  const admin = isAdmin();
  if (admin) {
    const pendingBtn = document.getElementById("tab-pending");
    pendingBtn.classList.toggle("btn-primary", active === "pending");
    pendingBtn.classList.toggle("btn-outline-primary", active !== "pending");
  }

  const dataBtn = document.getElementById("tab-data");
  dataBtn.classList.toggle("btn-primary", active === "data");
  dataBtn.classList.toggle("btn-outline-primary", active !== "data");
}

async function loadPending() {
  const content = document.getElementById("inventaris-content");
  content.innerHTML = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>No</th>
          <th>Kode Barang</th>
          <th>Nama Barang</th>
          <th>Jumlah</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody id="pending-body"></tbody>
    </table>
  `;
  renderPending();
}

async function renderPending() {
  const tbody = document.getElementById("pending-body");
  tbody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

  let data = [];
  try {
    data = await getInventarisPending();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6">Gagal load data</td></tr>`;
    return;
  }

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6">Tidak ada data pending</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map(
      (trx, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><b>${trx.item?.kode ?? "-"}</b></td>
        <td>${trx.item?.nama ?? "-"}</td>
        <td>${trx.jumlah}</td>
        <td><span class="badge bg-warning text-dark">Pending</span></td>
        <td>
          <button class="btn btn-sm btn-success open-modal-btn"
            data-id="${trx.id}"
            data-kode="${trx.item?.kode}"
            data-nama="${trx.item?.nama}"
            data-tanggal="${trx.tanggal}">
            ⚡ Generate
          </button>
        </td>
      </tr>
    `,
    )
    .join("");

  tbody.querySelectorAll(".open-modal-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal({
        id: btn.dataset.id,
        kode: btn.dataset.kode,
        tanggal: btn.dataset.tanggal,
      });
    });
  });
}

async function loadDataInventaris() {
  const admin = isAdmin();
  const content = document.getElementById("inventaris-content");
  content.innerHTML = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>No</th>
          <th>Kode Inventaris</th>
          <th>Nama Barang</th>
          <th>Status</th>
          ${admin ? `<th>Aksi</th>` : ""}
        </tr>
      </thead>
      <tbody id="data-body"></tbody>
    </table>
  `;
  renderDataInventaris();
}

async function renderDataInventaris() {
  const admin = isAdmin();
  const tbody = document.getElementById("data-body");
  tbody.innerHTML = `<tr><td colspan="${admin ? 5 : 4}">Loading...</td></tr>`;

  let data = [];
  try {
    data = await getInventaris();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="${admin ? 5 : 4}">Gagal load</td></tr>`;
    return;
  }

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="${admin ? 5 : 4}">Tidak ada data</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map(
      (inv, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>
          ${
            admin
              ? `<input value="${inv.kode_inventaris}" data-id="${inv.id}" class="form-control form-control-sm kode-input" />`
              : inv.kode_inventaris
          }
        </td>
        <td>${inv.item?.nama ?? "-"}</td>
        <td><span class="badge bg-success">${inv.status}</span></td>
        ${
          admin
            ? `
        <td>
          <button class="btn btn-sm btn-primary save-btn" data-id="${inv.id}">💾 Save</button>
        </td>
        `
            : ""
        }
      </tr>
    `,
    )
    .join("");

  if (admin) {
    tbody.querySelectorAll(".save-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const input = document.querySelector(`.kode-input[data-id="${id}"]`);
        try {
          await updateInventaris(id, { kode_inventaris: input.value });
          showToast("Berhasil update ✅");
        } catch (err) {
          showToast(err.message, "error");
        }
      });
    });
  }
}

let selectedTransaksiId = null;

function openModal(data) {
  const modal = document.getElementById("modal-inventaris");
  selectedTransaksiId = data.id;
  document.getElementById("modal-kode").value = data.kode;

  const date = new Date(data.tanggal);
  const bulan = String(date.getMonth() + 1).padStart(2, "0");
  const tahun = date.getFullYear();

  const ruanganInput = document.getElementById("modal-ruangan");
  const preview = document.getElementById("modal-preview");

  function updatePreview() {
    const ruangan = ruanganInput.value || "XXX";
    preview.value = `KPRDS/${data.kode}/${bulan}/${tahun}/${ruangan}/001`;
  }

  ruanganInput.oninput = () => {
    ruanganInput.value = ruanganInput.value.toUpperCase().replace(/\s+/g, "_");
    updatePreview();
  };

  updatePreview();
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("modal-inventaris").style.display = "none";
}

document.addEventListener("click", async (e) => {
  if (e.target.id === "btn-save-inventaris") {
    const btn = e.target;
    const ruangan = document.getElementById("modal-ruangan").value;

    if (!ruangan) {
      showToast("Ruangan wajib diisi!", "error");
      return;
    }

    btn.disabled = true;
    btn.innerText = "Processing...";

    try {
      await generateInventaris(selectedTransaksiId, ruangan);
      showToast("Berhasil generate 🔥");
      closeModal();
      renderPending();
    } catch (err) {
      showToast(err.message, "error");
      btn.disabled = false;
      btn.innerText = "💾 Simpan";
    }
  }

  if (e.target.id === "btn-close-modal") {
    closeModal();
  }
});

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}
