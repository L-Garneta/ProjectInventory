const BASE_URL = "http://127.0.0.1:8000/api";

// ================= CORE FETCH =================
async function safeFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: "Bearer " + token }),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // 🔥 AUTO LOGOUT kalau token invalid
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.hash = "/login";
    return;
  }

  const text = await res.text();

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.message || "Terjadi kesalahan");
    }

    return data;
  } catch (e) {
    console.error("Response bukan JSON:", text);
    throw new Error("Server error (cek Laravel)");
  }
}

// ================= DASHBOARD =================
export async function getDashboardData() {
  return await safeFetch(`${BASE_URL}/dashboard`);
}

// ================= ITEMS =================
export async function getItems() {
  return await safeFetch(`${BASE_URL}/items`);
}

export async function addItem(item) {
  return await safeFetch(`${BASE_URL}/items`, {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function updateItem(id, item) {
  return await safeFetch(`${BASE_URL}/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}

export async function deleteItem(id) {
  return await safeFetch(`${BASE_URL}/items/${id}`, {
    method: "DELETE",
  });
}

// ================= TRANSAKSI MASUK =================
export async function getTransaksiMasuk() {
  return await safeFetch(`${BASE_URL}/transaksi-masuk`);
}

export async function addTransaksiMasuk(data) {
  return await safeFetch(`${BASE_URL}/transaksi-masuk`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteTransaksiMasuk(id) {
  return await safeFetch(`${BASE_URL}/transaksi-masuk/${id}`, {
    method: "DELETE",
  });
}

// ================= TRANSAKSI KELUAR =================
export async function getTransaksiKeluar() {
  return await safeFetch(`${BASE_URL}/transaksi-keluar`);
}

export async function addTransaksiKeluar(data) {
  return await safeFetch(`${BASE_URL}/transaksi-keluar`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteTransaksiKeluar(id) {
  return await safeFetch(`${BASE_URL}/transaksi-keluar/${id}`, {
    method: "DELETE",
  });
}

// ================= PURCHASING =================
export async function getPurchasing() {
  return await safeFetch(`${BASE_URL}/purchasing`);
}

export async function addPurchasing(data) {
  return await safeFetch(`${BASE_URL}/purchasing`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePurchasing(id, data) {
  return await safeFetch(`${BASE_URL}/purchasing/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePurchasing(id) {
  return await safeFetch(`${BASE_URL}/purchasing/${id}`, {
    method: "DELETE",
  });
}

// ================= INVENTARIS =================
export async function getInventaris() {
  return await safeFetch(`${BASE_URL}/inventaris`);
}

export async function getInventarisPending() {
  return await safeFetch(`${BASE_URL}/inventaris/pending`);
}

export async function generateInventaris(transaksi_id, ruangan) {
  return await safeFetch(`${BASE_URL}/inventaris/generate`, {
    method: "POST",
    body: JSON.stringify({ transaksi_id, ruangan }),
  });
}

export async function updateInventaris(id, data) {
  return await safeFetch(`${BASE_URL}/inventaris/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
