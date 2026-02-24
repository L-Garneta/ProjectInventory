// ==================== KONFIGURASI ====================
const CONFIG = {
    API_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL', // Ganti dengan URL deployment Anda
    appName: 'Inventory Baru'
};

// State management
let currentPage = 'dashboard';
let config = {
    kategori: [],
    ruangan: [],
    satuan: []
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    loadPage('dashboard');
    checkSidebarState();
});

// ==================== PAGE LOADING ====================
async function loadPage(page) {
    try {
        showLoading();
        
        // Update active menu
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[href="#${page}"]`).classList.add('active');
        
        currentPage = page;
        
        // Load page content
        const response = await fetch(`pages/${page}.html`);
        const html = await response.text();
        document.getElementById('page-content').innerHTML = html;
        
        // Initialize page
        switch(page) {
            case 'dashboard':
                initDashboard();
                break;
            case 'master-barang':
                initMasterBarang();
                break;
            case 'transaksi-masuk':
                initTransaksiMasuk();
                break;
            case 'transaksi-keluar':
                initTransaksiKeluar();
                break;
            case 'laporan':
                initLaporan();
                break;
        }
        
        hideLoading();
    } catch (error) {
        showToast('Error loading page: ' + error.message, 'error');
        hideLoading();
    }
}

// ==================== API CALLS ====================
async function callApi(action, params = {}) {
    try {
        showLoading();
        
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: action,
                ...params
            })
        });
        
        const data = await response.json();
        hideLoading();
        return data;
    } catch (error) {
        hideLoading();
        showToast('Error: ' + error.message, 'error');
        throw error;
    }
}

async function loadConfig() {
    try {
        const response = await callApi('getConfig');
        if (response.status === 'success') {
            config = response;
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// ==================== DASHBOARD ====================
async function initDashboard() {
    try {
        const data = await callApi('getDashboardData');
        if (data.success) {
            renderDashboard(data.data);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Error loading dashboard', 'error');
    }
}

function renderDashboard(data) {
    // Stats cards
    document.getElementById('total-barang').textContent = data.totalBarang || 0;
    document.getElementById('barang-kritis').textContent = data.barangKritis || 0;
    document.getElementById('total-masuk').textContent = data.totalMasukBulan || 0;
    document.getElementById('total-keluar').textContent = data.totalKeluarBulan || 0;
    document.getElementById('bulan-info').textContent = data.bulan || '';
    
    // Barang kritis list
    if (data.barangKritisList && data.barangKritisList.length > 0) {
        const tbody = document.getElementById('kritis-list');
        tbody.innerHTML = data.barangKritisList.map(item => `
            <tr>
                <td>${item.kode}</td>
                <td>${item.nama}</td>
                <td class="danger">${item.stok}</td>
                <td>${item.stokMin}</td>
            </tr>
        `).join('');
    }
}

// ==================== MASTER BARANG ====================
async function initMasterBarang() {
    loadMasterBarang();
    setupMasterBarangForm();
}

async function loadMasterBarang() {
    try {
        const result = await callApi('getMasterBarang');
        if (result.success) {
            renderMasterBarang(result.data);
        }
    } catch (error) {
        showToast('Error loading master barang', 'error');
    }
}

function renderMasterBarang(data) {
    const tbody = document.getElementById('master-barang-list');
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">Tidak ada data</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.kode}</td>
            <td>${item.nama}</td>
            <td>${item.kategori}</td>
            <td>${item.ruangan}</td>
            <td>${item.satuan}</td>
            <td class="${getStokClass(item.stok, item.stokMin)}">${item.stok}</td>
            <td>${item.stokMin}</td>
            <td>${item.deskripsi || '-'}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editBarang('${item.kode}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="hapusBarang('${item.kode}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function setupMasterBarangForm() {
    const modal = document.getElementById('modal');
    const form = document.getElementById('barang-form');
    
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const result = await callApi('tambahBarang', data);
            if (result.success) {
                showToast(result.message, 'success');
                closeModal();
                loadMasterBarang();
            } else {
                showToast(result.message, 'error');
            }
        };
    }
}

function showTambahBarang() {
    showModal('Tambah Barang', `
        <form id="barang-form">
            <div class="form-group">
                <label>Nama Barang *</label>
                <input type="text" name="nama" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Kategori *</label>
                    <select name="kategori" required>
                        <option value="">Pilih Kategori</option>
                        ${config.kategori.map(k => `<option value="${k}">${k}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Ruangan *</label>
                    <select name="ruangan" required>
                        <option value="">Pilih Ruangan</option>
                        ${config.ruangan.map(r => `<option value="${r}">${r}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Satuan *</label>
                    <select name="satuan" required>
                        <option value="">Pilih Satuan</option>
                        ${config.satuan.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Stok Minimum</label>
                    <input type="number" name="stokMin" value="10" min="0">
                </div>
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <textarea name="deskripsi" rows="3"></textarea>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Simpan</button>
                <button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button>
            </div>
        </form>
    `);
}

async function editBarang(kode) {
    try {
        const result = await callApi('getMasterBarang');
        if (result.success) {
            const barang = result.data.find(b => b.kode === kode);
            if (barang) {
                showModal('Edit Barang', `
                    <form id="barang-form">
                        <input type="hidden" name="kode" value="${barang.kode}">
                        <div class="form-group">
                            <label>Nama Barang *</label>
                            <input type="text" name="nama" value="${barang.nama}" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Kategori *</label>
                                <select name="kategori" required>
                                    ${config.kategori.map(k => 
                                        `<option value="${k}" ${k === barang.kategori ? 'selected' : ''}>${k}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Ruangan *</label>
                                <select name="ruangan" required>
                                    ${config.ruangan.map(r => 
                                        `<option value="${r}" ${r === barang.ruangan ? 'selected' : ''}>${r}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Satuan *</label>
                                <select name="satuan" required>
                                    ${config.satuan.map(s => 
                                        `<option value="${s}" ${s === barang.satuan ? 'selected' : ''}>${s}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Stok Minimum</label>
                                <input type="number" name="stokMin" value="${barang.stokMin}" min="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Deskripsi</label>
                            <textarea name="deskripsi" rows="3">${barang.deskripsi || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Update</button>
                            <button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button>
                        </div>
                    </form>
                `);
                
                const form = document.getElementById('barang-form');
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    
                    const result = await callApi('updateBarang', data);
                    if (result.success) {
                        showToast(result.message, 'success');
                        closeModal();
                        loadMasterBarang();
                    } else {
                        showToast(result.message, 'error');
                    }
                };
            }
        }
    } catch (error) {
        showToast('Error loading barang', 'error');
    }
}

async function hapusBarang(kode) {
    if (!confirm('Yakin ingin menghapus barang ini?')) return;
    
    const result = await callApi('hapusBarang', { kode });
    if (result.success) {
        showToast(result.message, 'success');
        loadMasterBarang();
    } else {
        showToast(result.message, 'error');
    }
}

// ==================== TRANSAKSI MASUK ====================
async function initTransaksiMasuk() {
    setupTransaksiMasukForm();
}

function setupTransaksiMasukForm() {
    const form = document.getElementById('form-masuk');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Set tanggal
            data.tanggal = new Date();
            
            const result = await callApi('simpanBarangMasuk', data);
            if (result.success) {
                showToast(result.message, 'success');
                form.reset();
            } else {
                showToast(result.message, 'error');
            }
        };
    }
}

// ==================== TRANSAKSI KELUAR ====================
async function initTransaksiKeluar() {
    setupTransaksiKeluarForm();
}

function setupTransaksiKeluarForm() {
    const form = document.getElementById('form-keluar');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Set tanggal
            data.tanggal = new Date();
            
            const result = await callApi('simpanBarangKeluar', data);
            if (result.success) {
                showToast(result.message, 'success');
                form.reset();
            } else {
                showToast(result.message, 'error');
            }
        };
    }
}

// ==================== LAPORAN ====================
async function initLaporan() {
    setupLaporanForm();
    loadLaporan();
}

function setupLaporanForm() {
    const form = document.getElementById('form-laporan');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const filter = Object.fromEntries(formData.entries());
            loadLaporan(filter);
        };
    }
}

async function loadLaporan(filter = { tipe: 'semua' }) {
    try {
        const result = await callApi('getLaporan', filter);
        if (result.success) {
            renderLaporan(result.data);
        }
    } catch (error) {
        showToast('Error loading laporan', 'error');
    }
}

function renderLaporan(data) {
    const tbody = document.getElementById('laporan-list');
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Tidak ada data</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(item => {
        if (item.tipe === 'Stok') {
            return `
                <tr>
                    <td>${item.tipe}</td>
                    <td>-</td>
                    <td>${item.nama}</td>
                    <td>${item.kategori}</td>
                    <td>${item.ruangan}</td>
                    <td>${item.stok} ${item.satuan}</td>
                    <td><span class="badge badge-${getStatusClass(item.status)}">${item.status}</span></td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td>${item.tipe}</td>
                    <td>${formatDate(item.tanggal)}</td>
                    <td>${item.nama}</td>
                    <td>${item.kategori || '-'}</td>
                    <td>${item.ruangan}</td>
                    <td>${item.jumlah}</td>
                    <td>${item.keterangan || item.keperluan || '-'}</td>
                </tr>
            `;
        }
    }).join('');
}

// ==================== UTILITY FUNCTIONS ====================
function showLoading() {
    document.getElementById('loading').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', 
        document.getElementById('sidebar').classList.contains('collapsed'));
}

function checkSidebarState() {
    const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (collapsed) {
        document.getElementById('sidebar').classList.add('collapsed');
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
}

function getStokClass(stok, stokMin) {
    stok = Number(stok) || 0;
    stokMin = Number(stokMin) || 0;
    
    if (stok === 0) return 'danger';
    if (stok <= stokMin) return 'warning';
    return '';
}

function getStatusClass(status) {
    switch(status) {
        case 'Aman': return 'success';
        case 'Menipis': return 'warning';
        case 'Kritis': return 'danger';
        case 'Habis': return 'danger';
        default: return 'secondary';
    }
}

// Search function
function searchTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toUpperCase();
    const table = document.getElementById(tableId);
    const tr = table.getElementsByTagName('tr');
    
    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const textValue = td[j].textContent || td[j].innerText;
                if (textValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }
        
        tr[i].style.display = found ? '' : 'none';
    }
}