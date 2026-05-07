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

export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function getRole() {
  const user = getUser();
  return user?.role || null;
}

export function isAdmin() {
  return getRole() === "admin";
}

export function isStaff() {
  return getRole() === "staff";
}
