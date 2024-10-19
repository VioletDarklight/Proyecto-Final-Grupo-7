document.addEventListener("DOMContentLoaded", function () {
  let profileForm = document.getElementById("profileForm");
  let profilePicInput = document.getElementById("profilePicInput");
  let profilePic = document.getElementById("profilePic");
  let emailProfile = document.getElementById("emailProfile");
  let profileInputs = document.getElementsByClassName("required-input");

  // Verificación de logueo
  if (!localStorage.getItem("username")) {
    window.location.href = "login.html"; // Redirigir al login si no está logueado
  } else {
    emailProfile.value = localStorage.getItem("username"); // Mantener email al ingresar al perfil
  }

  // Cargar datos del perfil si existen en localStorage
  loadProfileData();

  // Manejar envío del formulario
  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Validar todos los inputs y dar feedback
    if (validateInputs()) {
      saveProfileData();
      showAlertSuccess();
    }

    // Reporte de errores si la validación falla
    profileForm.classList.add("was-validated");
  });

  // Manejar cambio de foto de perfil
  profilePicInput.addEventListener("change", function (event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = function (e) {
        profilePic.src = e.target.result; // Mostrar la nueva imagen
        localStorage.setItem("profilePic", e.target.result); // Guardar la imagen en localStorage
      };
      reader.readAsDataURL(file);
    }
  });

  // Cargar imagen de perfil desde localStorage
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

  // Función para mostrar la alerta de éxito
  function showAlertSuccess() {
    let alertSuccess = document.getElementById("alert-success");
    alertSuccess.classList.add("show");
    setTimeout(() => alertSuccess.classList.remove("show"), 500); // Ocultar después de 0.5 segundos
  }

  // Función de validación
  function validateInputs() {
    let isValid = true;
    Array.from(profileInputs).forEach((input) => {
      if (!input.checkValidity()) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        isValid = false; // Si hay algún input inválido, cambia isValid a false
      } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
      }

      // Habilitar validación en tiempo real
      input.addEventListener("input", realTimeValidation);
    });
    return isValid;
  }

  // Función de validación en tiempo real
  function realTimeValidation(event) {
    if (event.target.checkValidity()) {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
    } else {
      event.target.classList.add("is-invalid");
      event.target.classList.remove("is-valid");
    }
  }

  // Activar inicialmente la validación en tiempo real en los inputs
  Array.from(profileInputs).forEach((input) => {
    input.addEventListener("input", realTimeValidation);
  });
});
