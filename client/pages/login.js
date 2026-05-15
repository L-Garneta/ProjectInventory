import { Navbar, initNavbar } from "../components/navbar.js";
import { loadPage } from "../router.js";

export function Login() {
  return `
    <div class="login-page">
      <div class="login-overlay">
        <div class="login-card">
          <h2>Login</h2>
          <div class="form-group">
            <label>Nama</label>
            <input type="text" id="name" placeholder="Masukkan nama" required />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select id="role" required>
              <option value="" disabled selected>Pilih role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="username" placeholder="admin@gmail.com" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          <p id="error" class="error-text"></p>
          <button type="button" id="loginBtn" class="btn-primary">Login</button>
        </div>
      </div>
    </div>
  `;
}

export function initLogin(onSuccess) {
  document
    .getElementById("loginBtn")
    .addEventListener("click", async function () {
      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login gagal");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const navbarEl = document.getElementById("navbar");
        if (navbarEl) {
          navbarEl.innerHTML = Navbar();
          initNavbar((page) => loadPage(page));
        }

        onSuccess?.();
      } catch (err) {
        document.getElementById("error").textContent = err.message;
      }
    });
}
