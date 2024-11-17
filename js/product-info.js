// Definimos variable prodID que almacenará el valor obtenido del localStorage
let prodID = localStorage.getItem("prodID");

// URL que apunta al JSON que contiene la información del producto
let prodInfoURL =
  "https://japceibal.github.io/emercado-api/products/" + prodID + ".json";

// URL que apunta al JSON que contiene la información de comentarios
let prodCommURL =
  "https://japceibal.github.io/emercado-api/products_comments/" +
  prodID +
  ".json";

// Variables de referencias a elementos del HTML
let containerInfo = document.getElementsByClassName("containerInfo")[0];
let containerMainImage =
  document.getElementsByClassName("containerMainImage")[0];
let containerSecondaryImages = document.getElementsByClassName(
  "containerSecondaryImages"
)[0];
let productName = document.getElementById("product-name");
let containerComm = document.getElementById("containerComm");

// Cargar y mostrar datos iniciales del producto
fetch(prodInfoURL)
  .then((response) => response.json())
  .then((infoCard) => {
    showProduct(infoCard);
  });

// Función para mostrar los detalles del producto
function showProduct(infoCard) {
  // Mostrar el nombre del producto fuera del contenedor
  productName.textContent = infoCard.name;

  containerInfo.innerHTML += `
    <div class="productInfo"> 
    <h3 class="st-products mt-3">Detalles del producto:</h3>
      <p>${infoCard.description}</p>
      <p class="st-products-category">Categoría: </br><span>${infoCard.category}</span></p>
      <p class="totalSold st-products-category">Cantidad de vendidos:</br><span>${infoCard.soldCount} vendidos<span></p>
      <p class="product-cost st-products-category">Precio:</br><span>${infoCard.cost}${infoCard.currency}</span></p>
    <div class="buy-btn-container">
    <button class="btn-comprar">AÑADIR AL CARRITO</button>
    </div>
      </div>
  `;

  containerMainImage.innerHTML += `
    <img class="mainImage" id=mainImage src="${infoCard.images[0]}" alt="imagen principal">
  `;

  changeMainImage(infoCard.images[0]);
  //Bucle que recorre el array de imágenes
  for (let i = 0; i < infoCard.images.length; i++) {
    let img = infoCard.images[i]; //En cada iteración, extraemos una imagen del array y la guardamos en la variable img

    //Agrega nueva imagen dentro de containerSecondaryImages.
    //Cada imagen tiene un evento que llama a la función changeMainImage cuando es clickeada, para que cambie la imagen principal.
    containerSecondaryImages.innerHTML += `
      <img onclick="changeMainImage('${img}')" class="unitImages" src="${img}" alt="">
    `;
  }
}

// Función para cambiar la imagen principal del producto
function changeMainImage(src) {
  let mainImage = document.getElementById("mainImage");
  mainImage.src = src;
}

// Cargar y mostrar datos iniciales de comentarios
fetch(prodCommURL)
  .then((response) => response.json())
  .then((commCard) => {
    // Combinar comentarios de la API con los del localStorage
    let storedComments =
      JSON.parse(localStorage.getItem(`storedComments_${prodID}`)) || [];
    let allComments = [...commCard, ...storedComments];
    showProdCommInfo(allComments);
  });

// Función para mostrar los comentarios
function showProdCommInfo(commCard) {
  containerComm.innerHTML = `
    <h3 class="titleOpinions">Opiniones</h3>
  `;

  // Si no hay comentarios
  if (commCard.length === 0) {
    containerComm.innerHTML += `
      <p class="not-comment">Aún no hay comentarios</p>
    `;
  }

  // Iterar sobre el array de los comentarios
  for (const item of commCard) {
    containerComm.innerHTML += `
      <div class="commentCard">
        <p class="stars">${scoreStars(item.score)}</p>
        <p class="commentDescription">${item.description}</p>
        <p class="userNameComment">${item.user}</p>
        <p class="dataComment">${formatDate(item.dateTime)} hs</p>
      </div>
    
    `;
  }

  //Formulario de nuevo comentario
  containerComm.innerHTML += `
  <p>
    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" id="btnNewComm">
      AGREGAR COMENTARIO
    </button>
  </p>
  <div class="collapse" id="collapseExample">
    <div class="card card-body1">
 <form id="newCommentForm">
          <p class="clasificacion">
            <input id="radio1" type="radio" name="estrellas" value="5">
            <label for="radio1">★</label>
            <input id="radio2" type="radio" name="estrellas" value="4">
            <label for="radio2">★</label>
            <input id="radio3" type="radio" name="estrellas" value="3">
            <label for="radio3">★</label>
            <input id="radio4" type="radio" name="estrellas" value="2">
            <label for="radio4">★</label>
            <input id="radio5" type="radio" name="estrellas" value="1">
            <label for="radio5">★</label>
          </p>

          <input type="text" class="cajadeescritura" id="commentText" placeholder="Escribe algo aquí...">
          <br>
          <p class="userNameComment" id="userNameComm"> usuario </p>
          <p id="display-time" class="dataComment"></p>
          <br>
          <button class="btn btn-success" type="submit" id="botonenviar">ENVIAR</button>
        </form>
    </div>
  </div>
    `;
  showUserName();

  // Evento para manejar el envío del comentario
  document
    .getElementById("newCommentForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      addNewComment();
      location.reload((href = "#newCommentForm"));
    });

  //Evento para desaparecer botón de nuevo comentario
  let btnNewComm = document.getElementById("btnNewComm");
  btnNewComm.addEventListener("click", () => {
    btnNewComm.remove();
  });

  // Función para manejar el feedback de los campos
  function setFeedback(input, feedbackElement, isValid, message) {
    if (isValid) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
      feedbackElement.innerText = "";
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      feedbackElement.innerText = message;
    }
  }

  // Validación en tiempo real para el campo de texto del comentario
  let commentInput = document.getElementById("commentText");
  commentInput.addEventListener("input", function () {
    let isValid = this.value.trim() !== "";
    setFeedback(
      this,
      document.getElementById("feedbackCommentText"),
      isValid,
      "Este campo es obligatorio"
    );
  });

  // Validación en tiempo real para las estrellas
  let starInputs = document.getElementsByName("estrellas");
  starInputs.forEach((star) => {
    star.addEventListener("change", function () {
      validateStars();
    });
  });

  // Función para validar y mostrar feedback de las estrellas
  function validateStars() {
    let starInputs = document.getElementsByName("estrellas");
    let ratingChecked = Array.from(starInputs).some((star) => star.checked);
    let feedbackStar = document.getElementById("feedbackStar");

    if (!ratingChecked) {
      feedbackStar.style.display = "block";
      feedbackStar.innerText = "Debes seleccionar una calificación";
    } else {
      feedbackStar.style.display = "none";
      feedbackStar.innerText = "";
    }

    return ratingChecked;
  }

  // Función de validación general para el formulario
  function validateForm() {
    let isValid = true;

    // Validación del campo de comentario
    let commentText = document.getElementById("commentText");
    let isCommentValid = commentText.value.trim() !== "";
    setFeedback(
      commentText,
      document.getElementById("feedbackCommentText"),
      isCommentValid,
      "Este campo es obligatorio"
    );

    // Validación de las estrellas
    let isStarsValid = validateStars();

    isValid = isCommentValid && isStarsValid;
    return isValid;
  }

  // Evento para manejar el envío del formulario
  let commentForm = document.getElementById("newCommentForm");
  commentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateForm()) {
      addNewComment();

      // Limpiar el formulario y los estados de validación
      this.reset();
      let commentText = document.getElementById("commentText");
      commentText.classList.remove("is-valid", "is-invalid");

      let feedbackStar = document.getElementById("feedbackStar");
      let feedbackCommentText = document.getElementById("feedbackCommentText");
      feedbackStar.style.display = "none";
      feedbackStar.innerText = "";
      feedbackCommentText.innerText = "";
    }
  });

  // Función para mostrar la fecha y hora actual al escribir comentario
  function currentTime() {
    let currentDate = new Date();
    let formattedDate = formatDate(currentDate); //Le da el formato que usamos en los comentarios del json
    document.getElementById("display-time").innerText = formattedDate + " hrs";
  }
  currentTime();
  //Actualizar la hora cada minuto
  setInterval(currentTime, 60000);
}

// Función para agregar un nuevo comentario
function addNewComment() {
  let score = document.querySelector('input[name="estrellas"]:checked').value; // Obtener la puntuación del input seleccionado
  let description = document.getElementById("commentText").value;
  let user = localStorage.getItem("username");
  let dateTime = new Date();

  let newComment = {
    user: user,
    score: parseInt(score), //Convierte puntaje a número entero
    description: description,
    dateTime: dateTime,
  };

  // Guardar comentario en localStorage
  let storedComments =
    JSON.parse(localStorage.getItem(`storedComments_${prodID}`)) || []; //Si no hay comentarios en el localStorage, se inicia con un array vacío
  storedComments.push(newComment); //Agrega comentario al nuevo array
  localStorage.setItem(
    `storedComments_${prodID}`,
    JSON.stringify(storedComments)
  );

  // Agregar el nuevo comentario al contenedor de los que vienen del API
  containerComm.innerHTML += `
    <div class="commentCard">
      <p class="stars">${scoreStars(newComment.score)}</p>
      <p class="commentDescription">${newComment.description}</p>
      <p class="userNameComment">${newComment.user}</p>
      <p class="dataComment">${formatDate(newComment.dateTime)} hs</p>
    </div>
  `;

  alert("Comentario enviado exitosamente!");
}

//Función para mostrar nombre de usuario al escribir comentario
function showUserName() {
  let userName = localStorage.getItem("username");
  let userNameComm = document.getElementById("userNameComm");
  userNameComm.innerText = userName;
}
// Función para formatear la fecha de los comentarios
function formatDate(date) {
  let infoDate = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(date).toLocaleDateString("es-ES", infoDate);
}

// Función para convertir puntuación en estrellas
function scoreStars(score) {
  return "★".repeat(score) + "☆".repeat(5 - score);
}

// PRODUCTOS RELACIONADOS ENTREGA 4

//Spinner de carga al cambiar de producto
let spinnerHTML = `
<div id="loading-spinner" class="loading-overlay d-none">
  <div class="spinner-container">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", spinnerHTML);

let loadingSpinner = document.getElementById("loading-spinner");

// Función para mostrar el spinner
function showSpinnerRel() {
  loadingSpinner.classList.remove("d-none");
}

// Función para ocultar el spinner
function hideSpinnerRel() {
  loadingSpinner.classList.add("fade-out");
  setTimeout(() => {
    loadingSpinner.classList.add("d-none");
    loadingSpinner.classList.remove("fade-out");
  }, 300);
}

//Realizacion de fetch para obtener los datos que se encuentran dentro del json e Invocacion de funcion una vez obtenidos los mismos.
fetch(prodInfoURL)
  .then((response) => response.json())
  .then((infoRel) => {
    showRel(infoRel);
    hideSpinnerRel();
  });

let containerRelacionado = document.getElementById("carouselExampleCaptions");

//Funcion que toma los datos del fetch, En el cual incrustamos el html para poder mostrar lo requerido.
function showRel(infoRel) {
  containerRelacionado.innerHTML += `
  <div  class="carousel-inner data-bs-ride="carousel">
   <div class="carousel-item active ">
<div id="rel-card" class="card">
  <img id="img-rel0" src="${infoRel.relatedProducts[0].image}" class="card-img-top" alt="...">
  <div class="card-body card-button">
     <h5 class="card-title rel-name">${infoRel.relatedProducts[0].name}</h5> 
    <button  onclick="setProdID(${infoRel.relatedProducts[0].id}, event)" class="ver-ver0" type="button">VER MAS</button>
  </div>
</div>
</div>

<div  class=" card-text carousel-item ">
  <div id="carta-rel" class="card " >
    <img  id="img-rel" src="${infoRel.relatedProducts[1].image}" class="card-img-top" alt="...">
    <div class="card-body card-button">
     <h5 class="card-title mod-titulo rel-name">${infoRel.relatedProducts[1].name}</h5>
     <button onclick="setProdID(${infoRel.relatedProducts[1].id}, event)" class="ver-ver0" type="button">VER MAS</button>
    </div>
 </div>
</div>
  <button  class="carousel-control-prev h-50 button-rel" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev" >
    <span class="item carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next h-50 button-rel" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span class="item carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
`;
}
//funcion que realiza la actualizacion el id del local storage al hacer clic en el boton(linea 147 y 137) del producto del que quiere saber mas informacion.
function setProdID(id, event) {
  // Obtén el botón desde el evento
  const button = event.target;

  // Agrega clase loading al botón
  button.classList.add("loading");

  // Mostrar el spinner
  showSpinnerRel();

  // Remover el ID anterior y establecer el nuevo
  localStorage.removeItem("prodID");
  localStorage.setItem("prodID", id);

  // Delay para mostrar la animación
  setTimeout(() => {
    window.location = "product-info.html";
  }, 500);
}

/* Botón "Añadir al carrito" */
document.addEventListener("DOMContentLoaded", function () {
  let prodID = localStorage.getItem("prodID");
  if (prodID) {
    let prodInfoURL =
      "https://japceibal.github.io/emercado-api/products/" + prodID + ".json";
    let productName = document.getElementById("product-name");

    fetch(prodInfoURL)
      .then((response) => response.json())
      .then((infoCard) => {
        console.log("Producto cargado: ", infoCard);

        // Mostrar nombre del producto
        productName.textContent = infoCard.name;
        buyBtn(infoCard, prodID);
      });
  }
});

// Función para que todos los botones "Añadir al carrito" funcionen
function buyBtn(infoCard, prodID) {
  let buyBtns = Array.from(document.getElementsByClassName("btn-comprar"));

  buyBtns.forEach((boton) => {
    boton.addEventListener("click", function () {
      let productoComprado = {
        id: prodID,
        name: infoCard.name,
        cost: infoCard.cost,
        image: infoCard.images[0],
        currency: infoCard.currency,
        quantity: 1,
      };

      let badgeCarrito = document.getElementById("nav-carrito");
      badgeCarrito.classList.add("animate__animated", "animate__bounce");
      setTimeout(() => {
        badgeCarrito.classList.remove("animate__bounce");
      }, 1000);

      guardarCompraEnLocalStorage(productoComprado);
    });
  });
}

// Función para guardar o actualizar el producto en el localStorage
function guardarCompraEnLocalStorage(productoComprado) {
  let carrito = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  // Buscar si el producto ya existe en el carrito
  let existingProduct = carrito.find((item) => item.id === productoComprado.id);

  if (existingProduct) {
    // Si el producto ya está en el carrito, incrementa la cantidad
    existingProduct.quantity += 1;
  } else {
    // Si el producto no está en el carrito, agregarlo con cantidad inicial de 1
    productoComprado.quantity = 1;
    carrito.push(productoComprado);
  }

  // Guardar carrito actualizado en localStorage
  localStorage.setItem("shoppingCart", JSON.stringify(carrito));
  //Actualizar cantidad en el badge del carrito
  updateCartBadge();

  // Mostrar el modal de confirmación
  let confirmationModal = new bootstrap.Modal(
    document.getElementById("confirmationModal")
  );
  confirmationModal.show();

  // Configuración de botones dentro del modal
  document
    .getElementById("finalizarCompra")
    .addEventListener("click", function () {
      // Redirigir al carrito al hacer clic en "Finalizar compra"
      window.location.href = "cart.html";
    });
}

// Función para actualizar el badge del carrito
function updateCartBadge() {
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  let totalQuantity = cart.reduce((total, item) => total + item.quantity, 0); //Suma todas las cantidades de los items usando reduce
  cartBadge.textContent = totalQuantity || "0"; //Muestra la cantidad o "0" si el carrito está vacío
}
