// Verificación de autenticación al cargar index.html
document.addEventListener("DOMContentLoaded", () => {
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username"); //Nombre de usuario para navbar
  let currentPage = window.location.pathname.split("/").pop();
  let isRedirecting = new URLSearchParams(window.location.search).has(
    "redirected"
  );

  if (
    !token &&
    currentPage !== "login.html" &&
    currentPage !== "signup.html" &&
    !isRedirecting
  ) {
    // Redirigir al login.html si no está autenticado y no está ya en la página de login
    window.location.href = "login.html?redirected=true";
  }

  //Actualizacion navbar - nombre de usuario
  let userNav = document.getElementById("user-nav");
  if (token) {
    if (username) {
      userNav.textContent = username;
      userNav.href = "my-profile.html";
    }
  } else {
    userNav.textContent = "Iniciar Sesión";
    userNav.href = "/login.html";
  }

  //Funcion para limpiar el localstorage, al cerrar sesion
  let logout = document.getElementById("logout");
  logout.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  });
});

// Variables para el formulario y las alertas
let loginForm = document.getElementById("login-form");
let alertSuccess = document.getElementById("alert-success");
let alertError = document.getElementById("alert-danger");
let alertAuth = document.getElementById("alert-authentication");

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

//Función para usuario no autorizado
function showAlertAuth() {
  alertAuth.classList.add("show");
  setTimeout(() => alertAuth.classList.remove("show"), 2000); // Ocultar después de 2 segundos
}

// Manejar el envío del formulario
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Evitar el envío del formulario

  // Variables de usuario y contraseña
  let usuario = document.getElementById("usuario").value;
  let password = document.getElementById("password").value;

  // Validación para que no existan campos vacíos
  if (usuario === "" || password === "") {
    showAlertError();
    return;
  }

  try {
    // Enviar credenciales al backend
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: usuario, password }), // Cambiado para enviar credenciales al back
    });

    if (response.ok) {
      const data = await response.json(); // Obtengo token del backend
      localStorage.setItem("token", data.token); // Guarda el token en localStorage
      localStorage.setItem("username", usuario); // Guarda el usuario para el navbar

      // Redireccionar a la página de inicio si la validación es exitosa
      showAlertSuccess();
      setTimeout(() => (window.location.href = "index.html"), 1000); // Redirigir después de 1 segundo
    } else {
      showAlertAuth(); // Mostrar alerta de error si el login falla
    }
  } catch (error) {
    console.error("Error:", error.message);
    showAlertAuth();
  }
});
