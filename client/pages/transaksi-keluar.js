export function TransaksiKeluar() {
    return `
        <div class="container">
            <h2>Stok Keluar</h2>

            <div class="actions">
                <button id="btnTambah" class="btn green">+ Tambah Stok Keluar</button>
                <button id="btnHapusSemua" class="btn red">Hapus Semua</button>
            </div>

            <div class="filter">
                <label>Dari:</label>
                <input type="date" id="filterDari">
                <label>Sampai:</label>
                <input type="date" id="filterSampai">
                <button id="btnFilter" class="btn blue">Filter</button>
                <button id="btnReset" class="btn gray">Reset</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Tanggal</th>
                        <th>Kode</th>
                        <th>Nama Barang</th>
                        <th>Jumlah</th>
                        <th>Penerima</th>
                        <th>Keterangan</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="tableBody"></tbody>
            </table>
        </div>
    `;
}

export function initTransaksiKeluar() {

    const tableBody = document.getElementById("tableBody");
    const btnTambah = document.getElementById("btnTambah");
    const btnHapusSemua = document.getElementById("btnHapusSemua");
    const btnFilter = document.getElementById("btnFilter");
    const btnReset = document.getElementById("btnReset");

    let data = JSON.parse(localStorage.getItem("stokKeluar")) || [];

    function renderTable(filteredData = data) {
        tableBody.innerHTML = "";

        filteredData.forEach((item, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.tanggal}</td>
                    <td>${item.kode}</td>
                    <td>${item.nama}</td>
                    <td>${item.jumlah}</td>
                    <td>${item.penerima}</td>
                    <td>${item.keterangan}</td>
                    <td>
                        <button class="hapus" data-index="${index}">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    renderTable();

    // Tambah Data
    btnTambah.addEventListener("click", () => {
        const tanggal = prompt("Tanggal (YYYY-MM-DD):");
        const kode = prompt("Kode Barang:");
        const nama = prompt("Nama Barang:");
        const jumlah = prompt("Jumlah:");
        const penerima = prompt("Penerima:");
        const keterangan = prompt("Keterangan:");

        if (!tanggal || !kode) return;

        data.push({ tanggal, kode, nama, jumlah, penerima, keterangan });
        localStorage.setItem("stokKeluar", JSON.stringify(data));
        renderTable();
    });

    // Hapus Semua
    btnHapusSemua.addEventListener("click", () => {
        if (confirm("Yakin hapus semua data?")) {
            data = [];
            localStorage.removeItem("stokKeluar");
            renderTable();
        }
    });

    // Hapus per baris
    tableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("hapus")) {
            const index = e.target.dataset.index;
            data.splice(index, 1);
            localStorage.setItem("stokKeluar", JSON.stringify(data));
            renderTable();
        }
    });

    // Filter
    btnFilter.addEventListener("click", () => {
        const dari = document.getElementById("filterDari").value;
        const sampai = document.getElementById("filterSampai").value;

        const filtered = data.filter(item =>
            item.tanggal >= dari && item.tanggal <= sampai
        );

        renderTable(filtered);
    });

    btnReset.addEventListener("click", () => {
        renderTable();
    });
}