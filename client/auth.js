export function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.hash = "/login"; // 🔥 WAJIB
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.hash = "/login"; // 🔥 WAJIB
}
