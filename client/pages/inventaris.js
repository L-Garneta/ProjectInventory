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

    <!-- Modal -->
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

    <div id="toast" class="toast"></div>
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

  // event open modal
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

        showToast("Berhasil update ✅");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  });
}
let selectedTransaksiId = null;

function openModal(data) {
  const modal = document.getElementById("modal-inventaris");

  selectedTransaksiId = data.id;

  document.getElementById("modal-kode").value = data.kode;

  // ambil bulan & tahun
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
    // auto uppercase + ganti spasi jadi _
    ruanganInput.value = ruanganInput.value.toUpperCase().replace(/\s+/g, "_");

    updatePreview();
  };

  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("modal-inventaris").style.display = "none";
}

document.addEventListener("click", async (e) => {
  if (e.target.id === "btn-save-inventaris") {
    const btn = e.target; // 🔥 ambil tombolnya
    const ruangan = document.getElementById("modal-ruangan").value;

    if (!ruangan) {
      showToast("Ruangan wajib diisi!", "error");
      return;
    }

    // 🔥 disable tombol
    btn.disabled = true;
    btn.innerText = "Processing...";

    try {
      await generateInventaris(selectedTransaksiId, ruangan);

      showToast("Berhasil generate 🔥");
      closeModal();
      renderPending();
    } catch (err) {
      showToast(err.message, "error");

      // 🔥 aktifkan lagi kalau error
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
