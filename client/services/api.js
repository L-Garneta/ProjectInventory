const BASE_URL = "http://127.0.0.1:8000/api";

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Response bukan JSON:", text);
    throw new Error("Server error (cek Laravel)");
    // alert(e.message);
  }
}

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
  return await safeFetch(`${BASE_URL}/items`);
}

export async function addItem(item) {
  const res = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal tambah item");
  }

  return data;
}

export async function updateItem(id, item) {
  const res = await fetch(`${BASE_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal update item");
  }

  return data;
}

// DELETE barang (kalau nanti ada endpoint)
export async function deleteItem(id) {
  const res = await fetch(`${BASE_URL}/items/${id}`, {
    method: "DELETE",
  });
}

// ================= TRANSAKSI MASUK =================
// TAMBAH
export async function addTransaksiMasuk(data) {
  const res = await fetch(`${BASE_URL}/transaksi-masuk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
    method: "DELETE",
  });
}

// ================= TRANSAKSI KELUAR =================
export async function addTransaksiKeluar(data) {
  const res = await fetch(`${BASE_URL}/transaksi-keluar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function clearTransaksiKeluar() {
  await fetch(`${BASE_URL}/transaksi-keluar`, {
    method: "DELETE",
  });
}

// ================= TRANSAKSI KELUAR =================

// GET semua transaksi keluar
export async function getTransaksiKeluar() {
  const res = await fetch(`${BASE_URL}/transaksi-keluar`);
  return await res.json();
}

// DELETE transaksi keluar
export async function deleteTransaksiKeluar(id) {
  await fetch(`${BASE_URL}/transaksi-keluar/${id}`, {
    method: "DELETE",
  });
}

// ================= PURCHASING =================
export async function getPurchasing() {
  const res = await fetch(`${BASE_URL}/purchasing`);
  return await res.json();
}

export async function addPurchasing(data) {
  const res = await fetch(`${BASE_URL}/purchasing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
}

export async function updatePurchasing(id, data) {
  const res = await fetch(`${BASE_URL}/purchasing/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
}

export async function deletePurchasing(id) {
  const res = await fetch(`${BASE_URL}/purchasing/${id}`, {
    method: "DELETE",
  });

  return await res.json();
}
