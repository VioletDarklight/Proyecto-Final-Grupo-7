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
let containerComm = document.getElementById("container-comments");

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
  .then(showProdCommInfo);

// Función para mostrar los comentarios
function showProdCommInfo(comentarios) {
  // Si no hay comentarios
  if (comentarios.length === 0) {
    containerComm.innerHTML += `
      <p class="not-comment">Aún no hay comentarios</p>
    `;
  }

  // Iterar sobre el array de los comentarios
  for (const comentario of comentarios) {
    containerComm.innerHTML += `
      <div class="commentCard">
        <p class="stars">${scoreStars(comentario.score)}</p>
        <p class="commentDescription">${comentario.description}</p>
        <p class="userNameComment">${comentario.user}</p>
        <p class="dataComment">${formatDate(comentario.dateTime)} hs</p>
      </div>

    `;
  }

  let newcomment = document.getElementById("container-newcomment");

  newcomment.innerHTML += `
          <p>
            <input type="hidden" id="score" value="0">
            <span onclick="changeScore(1)" class="starbtn stars">☆</span>
            <span onclick="changeScore(2)" class="starbtn stars">☆</span>
            <span onclick="changeScore(3)" class="starbtn stars">☆</span>
            <span onclick="changeScore(4)" class="starbtn stars">☆</span>
            <span onclick="changeScore(5)" class="starbtn stars">☆</span>
          </p>
          <input class="commentDescription" type="text" id="mensaje" placeholder="Escribe tu comentario aquí">
          <p class="userNameComment" id="username">${localStorage.getItem(
    "username"
  )}</p>
          <p class="dataComment" id="datetime">${formatDate(new Date())} hs</p>
          <button onclick="sendComment()" type="button" id="sendbtn">Enviar</button>
          `;
}

function sendComment() {
  containerComm.innerHTML += `
    <div class="commentCard">
        <p class="stars">${scoreStars(document.getElementById("score").value)}</p>
        <p class="commentDescription">${document.getElementById("mensaje").value}</p>
        <p class="userNameComment">${document.getElementById("username").textContent}</p>
        <p class="dataComment">${document.getElementById("datetime").textContent} hs</p>
      </div>
    `;
}

function changeScore(score) {
  document.getElementById("score").value = score;

  let stars = document.getElementsByClassName("starbtn");

  for (let i = 0; i < score; i++) {
    stars[i].textContent = "★";
  }

  for (let i = score; i < 5; i++) {
    stars[i].textContent = "☆";
  }
}

// Función para formatear la fecha de los comentarios
function formatDate(date) {
  let infoDate = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric", //-> no me gustan como quedan, consulto en la próxima clase si los podemos sacar
  };
  return new Date(date).toLocaleDateString("es-ES", infoDate);
}

// Función para convertir puntuación en estrellas
function scoreStars(score) {
  return "★".repeat(score) + "☆".repeat(5 - score);
}
