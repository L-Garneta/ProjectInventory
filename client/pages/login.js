document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // akun default
  const validUser = "admin";
  const validPass = "12345";

  if (username === validUser && password === validPass) {
    // simpan status login
    localStorage.setItem("isLoggedIn", "true");

    // pindah ke halaman inventory
    window.location.href = "index.html";
  } else {
    document.getElementById("error").textContent = "Username atau password salah!";
  }
});