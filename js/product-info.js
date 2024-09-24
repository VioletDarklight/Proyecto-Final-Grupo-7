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
        <hr>
      </div>
    `;
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
    //second: "numeric", -> no me gustan como quedan, consulto en la próxima clase si los podemos sacar
  };
  return new Date(date).toLocaleDateString("es-UY", infoDate);
}

// Función para convertir puntuación en estrellas
function scoreStars(score) {
  return "★".repeat(score) + "☆".repeat(5 - score);
}
