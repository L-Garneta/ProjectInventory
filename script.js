let inventarisData = [];

// Fungsi untuk memuat data JSON
async function loadData() {
    try {
        const response = await fetch('data/inventaris.json');
        inventarisData = await response.json();
        displayData(inventarisData);
        updateStats();
        populateKategoriFilter();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('tableBody').innerHTML = 
            '<tr><td colspan="8" style="text-align: center; color: red;">Gagal memuat data. Pastikan file inventaris.json tersedia.</td></tr>';
    }
}

// Fungsi untuk menampilkan data
function displayData(data) {
    const tbody = document.getElementById('tableBody');
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Tidak ada data</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(item => {
        const totalHarga = item.jumlah * item.hargaSatuan;
        const statusClass = getStatusClass(item.jumlah);
        
        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.namaBarang}</td>
                <td>${item.kategori}</td>
                <td>${item.jumlah}</td>
                <td>Rp ${formatRupiah(item.hargaSatuan)}</td>
                <td>Rp ${formatRupiah(totalHarga)}</td>
                <td>${item.lokasi}</td>
                <td><span class="status-badge ${statusClass}">${getStatus(item.jumlah)}</span></td>
            </tr>
        `;
    }).join('');
}

// Fungsi untuk format Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID').format(angka);
}

// Fungsi untuk mendapatkan status berdasarkan jumlah
function getStatus(jumlah) {
    if (jumlah <= 0) return 'Habis';
    if (jumlah < 5) return 'Hampir Habis';
    return 'Tersedia';
}

// Fungsi untuk mendapatkan class status
function getStatusClass(jumlah) {
    if (jumlah <= 0) return 'status-habis';
    if (jumlah < 5) return 'status-minimum';
    return 'status-tersedia';
}

// Fungsi untuk update statistik
function updateStats() {
    const totalBarang = inventarisData.length;
    const totalKategori = new Set(inventarisData.map(item => item.kategori)).size;
    const totalNilai = inventarisData.reduce((sum, item) => sum + (item.jumlah * item.hargaSatuan), 0);
    
    document.getElementById('totalBarang').textContent = totalBarang;
    document.getElementById('totalKategori').textContent = totalKategori;
    document.getElementById('totalNilai').textContent = `Rp ${formatRupiah(totalNilai)}`;
}

// Fungsi untuk mengisi filter kategori
function populateKategoriFilter() {
    const kategoriSet = new Set(inventarisData.map(item => item.kategori));
    const filterSelect = document.getElementById('kategoriFilter');
    
    kategoriSet.forEach(kategori => {
        const option = document.createElement('option');
        option.value = kategori;
        option.textContent = kategori;
        filterSelect.appendChild(option);
    });
}

// Fungsi untuk filter data
function filterData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const kategori = document.getElementById('kategoriFilter').value;
    
    const filteredData = inventarisData.filter(item => {
        const matchesSearch = item.namaBarang.toLowerCase().includes(searchTerm) || 
                             item.id.toString().includes(searchTerm);
        const matchesKategori = kategori === 'all' || item.kategori === kategori;
        
        return matchesSearch && matchesKategori;
    });
    
    displayData(filteredData);
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', filterData);
document.getElementById('kategoriFilter').addEventListener('change', filterData);

// Load data saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadData);

// Fungsi untuk logout
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}