// Verificación de autenticación al cargar index.html
document.addEventListener("DOMContentLoaded", () => {
  let isAuthenticated = localStorage.getItem("isAuthenticated");
  let currentPage = window.location.pathname.split("/").pop();
  let isRedirecting = new URLSearchParams(window.location.search).has(
    "redirected"
  );

  if (
    !isAuthenticated &&
    currentPage !== "login.html" &&
    currentPage !== "signup.html" &&
    !isRedirecting
  ) {
    // Redirigir al login.html si no está autenticado y no está ya en la página de login
    window.location.href = "login.html?redirected=true";
  }
});

// Variables para el formulario y las alertas
let loginForm = document.getElementById("login-form");
let alertSuccess = document.getElementById("alert-success");
let alertError = document.getElementById("alert-danger");

// Función para mostrar la alerta de éxito
function showAlertSuccess() {
  alertSuccess.classList.add("show");
  setTimeout(() => alertSuccess.classList.remove("show"), 500); // Ocultar después de 0.5 segundos
}

// Función para mostrar la alerta de error
function showAlertError() {
  alertError.classList.add("show");
  setTimeout(() => alertError.classList.remove("show"), 2000); // Ocultar después de 2 segundos
}

// Manejar el envío del formulario
loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitar el envío del formulario

  // Variables de usuario y contraseña
  let usuario = document.getElementById("usuario").value;
  let password = document.getElementById("password").value;

  // Validación para que no existan campos vacíos
  if (usuario === "" || password === "") {
    showAlertError();
    return;
  }

  //Guardar autenticación de validación exitosa
  localStorage.setItem("isAuthenticated", "true");

  // Redireccionar a la página de inicio si la validación es exitosa
  showAlertSuccess();
  setTimeout(() => (window.location.href = "index.html"), 1000); // Redireccionar después de 1 segundo (para ver la alerta)
});
