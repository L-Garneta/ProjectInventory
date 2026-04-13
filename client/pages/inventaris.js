import { getInventarisPending, generateInventaris } from "../services/api.js";

export function Inventaris() {
  return `
    <div class="page">
      <div class="page-header">
        <h2>Inventaris</h2>
      </div>

      <div class="card card-soft shadow-sm">
        <div class="card-body">
          <table class="table table-striped table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="inventaris-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function initInventaris() {
  renderTable();
}

async function renderTable() {
  const tbody = document.getElementById("inventaris-tbody");

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
      (trx, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${trx.item?.nama ?? "-"}</td>
        <td>${trx.jumlah}</td>
        <td>
          <span class="badge bg-warning text-dark">
            Pending
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-success" data-id="${trx.id}">
            ⚡ Generate
          </button>
        </td>
      </tr>
    `,
    )
    .join("");

  // event tombol generate
  tbody.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("Generate inventaris untuk data ini?")) return;

      try {
        btn.disabled = true;
        btn.innerText = "Processing...";

        await generateInventaris(id);

        alert("Inventaris berhasil dibuat 🔥");
        renderTable();
      } catch (err) {
        alert(err.message);
        btn.disabled = false;
        btn.innerText = "⚡ Generate";
      }
    });
  });
}
