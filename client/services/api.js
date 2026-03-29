const BASE_URL = "http://127.0.0.1:8000/api";

// ================= DASHBOARD =================
export async function getDashboardData() {
    try {
        const response = await fetch(`${BASE_URL}/dashboard`);
        if (!response.ok) throw new Error("Gagal fetch dashboard");
        return await response.json();
    } catch (error) {
        console.error(error);
        return {};
    }
}

// ================= ITEMS =================

// GET semua barang
export async function getItems() {
    const res = await fetch(`${BASE_URL}/items`);
    return await res.json();
}

// TAMBAH barang
export async function addItem(item) {
    const res = await fetch(`${BASE_URL}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    return await res.json();
}

// UPDATE barang (kalau nanti ada endpoint)
export async function updateItem(id, item) {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    return await res.json();
}

// DELETE barang (kalau nanti ada endpoint)
export async function deleteItem(id) {
    await fetch(`${BASE_URL}/items/${id}`, {
        method: "DELETE"
    });
}

// ================= TRANSAKSI MASUK =================
// TAMBAH
export async function addTransaksiMasuk(data) {
    const res = await fetch(`${BASE_URL}/transaksi-masuk`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

// GET semua transaksi masuk
export async function getTransaksiMasuk() {
    const res = await fetch(`${BASE_URL}/transaksi-masuk`);
    return await res.json();
}
// HAPUS
export async function deleteTransaksiMasuk(id) {
    await fetch(`${BASE_URL}/transaksi-masuk/${id}`, {
        method: "DELETE"
    });
}

// ================= TRANSAKSI KELUAR =================
export async function addTransaksiKeluar(data) {
    const res = await fetch(`${BASE_URL}/transaksi-keluar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

export async function clearTransaksiKeluar() {
    await fetch(`${BASE_URL}/transaksi-keluar`, {
        method: "DELETE"
    });
}