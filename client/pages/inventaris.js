import {
  getInventarisPending,
  generateInventaris,
  getInventaris,
  updateInventaris,
} from "../services/api.js";

export function Inventaris() {
  return `
    <div class="page">
      <div class="page-header">
        <h2>Inventaris</h2>
      </div>

      <div class="mb-3">
        <button class="btn btn-primary btn-sm" id="tab-pending">Pending</button>
        <button class="btn btn-outline-primary btn-sm" id="tab-data">Data Inventaris</button>
      </div>

      <div id="inventaris-content"></div>
    </div>
  `;
}

export function initInventaris() {
  loadPending();

  document.getElementById("tab-pending").addEventListener("click", () => {
    setActiveTab("pending");
    loadPending();
  });

  document.getElementById("tab-data").addEventListener("click", () => {
    setActiveTab("data");
    loadDataInventaris();
  });
}

// ================= TAB STYLE =================
function setActiveTab(active) {
  const pendingBtn = document.getElementById("tab-pending");
  const dataBtn = document.getElementById("tab-data");

  pendingBtn.classList.remove("btn-primary");
  pendingBtn.classList.add("btn-outline-primary");

  dataBtn.classList.remove("btn-primary");
  dataBtn.classList.add("btn-outline-primary");

  if (active === "pending") {
    pendingBtn.classList.add("btn-primary");
    pendingBtn.classList.remove("btn-outline-primary");
  } else {
    dataBtn.classList.add("btn-primary");
    dataBtn.classList.remove("btn-outline-primary");
  }
}

// ================= PENDING =================
async function loadPending() {
  const content = document.getElementById("inventaris-content");

  content.innerHTML = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>No</th>
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

  tbody.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

  let data = [];

  try {
    data = await getInventarisPending();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5">Gagal load data</td></tr>`;
    return;
  }

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5">Tidak ada data pending</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map(
      (trx, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${trx.item?.nama ?? "-"}</td>
        <td>${trx.jumlah}</td>
        <td><span class="badge bg-warning text-dark">Pending</span></td>
        <td>
          <button class="btn btn-sm btn-success generate-btn" data-id="${trx.id}">
            ⚡ Generate
          </button>
        </td>
      </tr>
    `,
    )
    .join("");

  // event generate
  tbody.querySelectorAll(".generate-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("Generate inventaris?")) return;

      try {
        btn.disabled = true;
        btn.innerText = "Processing...";

        await generateInventaris(id);

        alert("Berhasil generate 🔥");
        renderPending();
      } catch (err) {
        alert(err.message);
        btn.disabled = false;
        btn.innerText = "⚡ Generate";
      }
    });
  });
}

// ================= DATA INVENTARIS =================
async function loadDataInventaris() {
  const content = document.getElementById("inventaris-content");

  content.innerHTML = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>No</th>
          <th>Kode Inventaris</th>
          <th>Nama Barang</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody id="data-body"></tbody>
    </table>
  `;

  renderDataInventaris();
}

async function renderDataInventaris() {
  const tbody = document.getElementById("data-body");

  tbody.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

  let data = [];

  try {
    data = await getInventaris();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5">Gagal load</td></tr>`;
    return;
  }

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5">Tidak ada data</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map(
      (inv, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>
          <input 
            value="${inv.kode_inventaris}" 
            data-id="${inv.id}" 
            class="form-control form-control-sm kode-input"
          />
        </td>
        <td>${inv.item?.nama ?? "-"}</td>
        <td><span class="badge bg-success">${inv.status}</span></td>
        <td>
          <button class="btn btn-sm btn-primary save-btn" data-id="${inv.id}">
            💾 Save
          </button>
        </td>
      </tr>
    `,
    )
    .join("");

  // event save
  tbody.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const input = document.querySelector(`.kode-input[data-id="${id}"]`);

      try {
        await updateInventaris(id, {
          kode_inventaris: input.value,
        });

        alert("Berhasil update ✅");
      } catch (err) {
        alert(err.message);
      }
    });
  });
}
