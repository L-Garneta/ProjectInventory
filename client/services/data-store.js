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