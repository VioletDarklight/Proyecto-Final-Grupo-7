document.addEventListener("DOMContentLoaded", function () {
  let profileForm = document.getElementById("profileForm");
  let darkModeSwitch = document.getElementById("darkModeSwitch");
  let profilePicInput = document.getElementById("profilePicInput");
  let profilePic = document.getElementById("profilePic");
  let emailProfile = document.getElementById("emailProfile");

  // Verificación de logueo
  if (!localStorage.getItem("username")) {
    window.location.href = "login.html"; // Redirigir al login si no está logueado
  } else {
    emailProfile.value = localStorage.getItem("username"); // Mantener email al ingresar al perfil
  }

  // Cargar datos del perfil si existen en localStorage
  loadProfileData();

  // Manejar envío del formulario
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar que la página se recargue

    if (profileForm.checkValidity()) {
      saveProfileData(); // Guardar datos si el formulario es válido
      alert("Perfil actualizado con éxito");
    } else {
      profileForm.reportValidity(); // Mostrar errores si no es válido
    }
  });

  // Manejar cambio de modo oscuro
  darkModeSwitch.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", darkModeSwitch.checked); // Guardar preferencia de modo
  });

  // Cargar el estado del modo oscuro
  darkModeSwitch.checked = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark-mode", darkModeSwitch.checked);

  /* let localEmail = localStorage.getItem("email");
  let dataComplete = JSON.parse(localStorage.getItem("data"));
  let savedImage = localStorage.getItem("image");*/

  // Manejar cambio de foto de perfil
  profilePicInput.addEventListener("change", function (event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic.src = e.target.result; // Mostrar la nueva imagen
        localStorage.setItem("profilePic", e.target.result); // Guardar la imagen en localStorage
      };
      reader.readAsDataURL(file);
    }
  });

  // Si ya hay una imagen de perfil en el localStorage, cargarla
  if (localStorage.getItem("profilePic")) {
    profilePic.src = localStorage.getItem("profilePic");
  }

  // Función para cargar datos del perfil
  function loadProfileData() {
    let profileData = JSON.parse(localStorage.getItem("profileData")) || {};
    for (let [key, value] of Object.entries(profileData)) {
      if (document.getElementById(key)) {
        document.getElementById(key).value = value;
      }
    }
  }
  // Función para guardar datos del perfil en localStorage
  function saveProfileData() {
    let profileData = {
      nameProfile: document.getElementById("nameProfile").value,
      secondNameProfile: document.getElementById("secondNameProfile").value,
      lastNameProfile: document.getElementById("lastNameProfile").value,
      secondLastNameProfile: document.getElementById("secondLastNameProfile")
        .value,
      phoneProfile: document.getElementById("phoneProfile").value,
    };
    localStorage.setItem("profileData", JSON.stringify(profileData));
  }
});
