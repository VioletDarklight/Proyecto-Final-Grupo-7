// Verificación de autenticación al cargar index.html
document.addEventListener("DOMContentLoaded", () => {
  let isAuthenticated = localStorage.getItem("isAuthenticated");
  let username = localStorage.getItem("username"); //Nombre de usuario para navbar
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

  //Actualizacion navbar - nombre de usuario
  let userNav = document.getElementById("user-nav");
  if (isAuthenticated) {
    if (username) {
      userNav.textContent = username;
      userNav.href = "/my-profile.html";
    }
  } else {
    userNav.textContent = "Iniciar Sesión";
    userNav.href = "/login.html";
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

function agregarCalificacion(comentario, calificacion) {
  // Crear un nuevo div para la calificación
  const nuevaCalificacion = document.createElement("div");
  nuevaCalificacion.classList.add("calificacion");
  nuevaCalificacion.innerHTML = `
      <div class="stars">${'★'.repeat(calificacion) + '☆'.repeat(5 - calificacion)}</div>
      <div class="comentario">${comentario}</div>
      <div class="autor">Usuario</div>
      <div class="fecha">${new Date().toLocaleString()}</div>
  `;

  // Agregar la nueva calificación al contenedor
  calificaciones.appendChild(nuevaCalificacion);
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
  localStorage.setItem("username", usuario); //Para nombre de usuario en navbar

  // Redireccionar a la página de inicio si la validación es exitosa
  showAlertSuccess();
  setTimeout(() => (window.location.href = "index.html"), 1000); // Redireccionar después de 1 segundo (para ver la alerta)
});
