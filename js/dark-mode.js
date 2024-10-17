document.addEventListener("DOMContentLoaded", function () {
  const darkModeSwitch = document.getElementById("darkModeSwitch");

  // Verificar el estado del modo oscuro en localStorage
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    darkModeSwitch.checked = true;
  }

  // Manejar cambio de modo oscuro
  if (darkModeSwitch) {
    darkModeSwitch.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", darkModeSwitch.checked); // Guardar preferencia de modo
    });
  }
});
