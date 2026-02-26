export function Login() {
  return `
    <div class="login-page">
      <h2>Login</h2>
      <form id="loginForm" class="login-form">
        <div class="form-group">
          <label>Username</label>
          <input type="text" id="username" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" id="password" required />
        </div>

        <p id="error" class="error-text"></p>

        <button type="submit" class="btn-primary">Login</button>
      </form>
    </div>
  `;
}

export function initLogin(onSuccess) {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // akun default
    const validUser = "admin";
    const validPass = "12345";

    if (username === validUser && password === validPass) {
      // simpan status login
      localStorage.setItem("isLoggedIn", "true");

      // callback ke app (redirect ke dashboard)
      onSuccess?.();
    } else {
      document.getElementById("error").textContent =
        "Username atau password salah!";
    }
  });
}