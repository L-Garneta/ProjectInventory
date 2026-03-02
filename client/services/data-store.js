const KEY = "inventory:data";

const seedData = {
    items: [
        { kode: "BRG001", nama: "Kabel LAN", kategori: "Elektronik", ruangan: "Gudang", stok: 2, stokMin: 5, satuan: "pcs" },
        { kode: "BRG002", nama: "Mouse", kategori: "Elektronik", ruangan: "Gudang", stok: 1, stokMin: 3, satuan: "pcs" },
        { kode: "BRG003", nama: "Keyboard", kategori: "Elektronik", ruangan: "Gudang", stok: 10, stokMin: 3, satuan: "pcs" },
    ],
    transaksiMasuk: [],
    transaksiKeluar: [],
};

export function initStore() {
    if (!localStorage.getItem(KEY)) {
        localStorage.setItem(KEY, JSON.stringify(seedData));
    }
}

function getStore() {
    return JSON.parse(localStorage.getItem(KEY));
}

function setStore(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function getItems() {
    return getStore().items;
}

export function addItem(item) {
    const data = getStore();
    data.items.push(item);
    setStore(data);
}

export function updateItem(kode, patch) {
    const data = getStore();
    const idx = data.items.findIndex((i) => i.kode === kode);
    if (idx !== -1) {
        data.items[idx] = { ...data.items[idx], ...patch };
        setStore(data);
    }
}

export function deleteItem(kode) {
    const data = getStore();
    data.items = data.items.filter((i) => i.kode !== kode);
    setStore(data);
}
export function getTransaksiMasuk() {
    return getStore().transaksiMasuk || [];
}

export function addTransaksiMasuk({
    kode,
    jumlah,
    supplier = "",
    penerima = "",
    keterangan = ""
}) {
    const data = getStore();

    const item = data.items.find((i) => i.kode === kode);
    if (!item) throw new Error("Barang tidak ditemukan");

    const qty = Number(jumlah) || 0;
    if (qty <= 0) throw new Error("Jumlah tidak valid");

    // Update stok
    item.stok = Number(item.stok || 0) + qty;

    data.transaksiMasuk.push({
        id: Date.now(),
        tanggal: new Date().toLocaleDateString("id-ID"),
        kode,
        nama: item.nama,
        jumlah: qty,
        supplier,
        penerima,
        ruangan: item.ruangan || "-",
        keterangan,
    });

    setStore(data);
}

export function deleteTransaksiMasuk(id) {
    const data = getStore();

    const trx = data.transaksiMasuk.find((t) => t.id === id);
    if (!trx) return;

    const item = data.items.find((i) => i.kode === trx.kode);
    if (item) {
        item.stok -= trx.jumlah;
    }

    data.transaksiMasuk = data.transaksiMasuk.filter((t) => t.id !== id);

    setStore(data);
}

// ==================== TRANSAKSI KELUAR ====================

export function getTransaksiKeluar() {
    return getStore().transaksiKeluar || [];
}

export function addTransaksiKeluar({
    kode,
    jumlah,
    penerima = "",
    keterangan = "",
}) {
    const data = getStore();

    const item = data.items.find((i) => i.kode === kode);
    if (!item) throw new Error("Barang tidak ditemukan");

    const qty = Number(jumlah) || 0;
    if (qty <= 0) throw new Error("Jumlah tidak valid");

    if (item.stok < qty) {
        throw new Error("Stok tidak mencukupi");
    }

    // Kurangi stok
    item.stok -= qty;

    data.transaksiKeluar.push({
        id: Date.now(),
        tanggal: new Date().toLocaleDateString("id-ID"),
        kode,
        nama: item.nama,
        jumlah: qty,
        penerima,
        ruangan: item.ruangan || "-",
        keterangan,
    });

    setStore(data);
}

export function deleteTransaksiKeluar(id) {
    const data = getStore();

    const trx = data.transaksiKeluar.find((t) => t.id === id);
    if (!trx) return;

    // Kembalikan stok
    const item = data.items.find((i) => i.kode === trx.kode);
    if (item) {
        item.stok += trx.jumlah;
    }

    data.transaksiKeluar = data.transaksiKeluar.filter((t) => t.id !== id);
    setStore(data);
}

export function clearTransaksiKeluar() {
    const data = getStore();

    // Kembalikan semua stok dulu
    data.transaksiKeluar.forEach((trx) => {
        const item = data.items.find((i) => i.kode === trx.kode);
        if (item) {
            item.stok += trx.jumlah;
        }
    });

    data.transaksiKeluar = [];
    setStore(data);
}