export function Login() {
  return `
    <div class="login-page">
      <h2>Login</h2>
      <form id="loginForm" class="login-form">
        <div class="form-group">
          <label>Email</label>
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

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // 🔥 SIMPAN TOKEN
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirect lewat router
      onSuccess?.();
    } catch (err) {
      document.getElementById("error").textContent = err.message;
    }
  });
}
