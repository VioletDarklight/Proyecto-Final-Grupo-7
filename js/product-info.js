// Definimos variable prodID que almacenará el valor obtenido del localStorage
let prodID = localStorage.getItem("prodID");

// URL que apunta al JSON que contiene la información del producto
let prodInfoURL =
  "https://japceibal.github.io/emercado-api/products/" + prodID + ".json";

// Variables de referencias a elementos del HTML
let containerInfo = document.getElementsByClassName("containerInfo")[0];
let containerMainImage =
  document.getElementsByClassName("containerMainImage")[0];
let containerSecondaryImages = document.getElementsByClassName(
  "containerSecondaryImages"
)[0];

// Cargar y mostrar datos iniciales del producto
fetch(prodInfoURL)
  .then((response) => response.json())
  .then((infoCard) => {
    showProduct(infoCard);
  });

// Función para mostrar los detalles del producto
function showProduct(infoCard) {
  containerInfo.innerHTML += `
    <div class="productInfo"> 
      <h1>${infoCard.name}</h1>
      <p class="totalSold">| ${infoCard.soldCount} vendidos</p>
      <p class="cost"><span class="currency">${infoCard.currency}</span> ${infoCard.cost}</p>
      <p class="st-products-category">Categoría: <span>${infoCard.category}</span></p>
      <h3 class="st-products mt-3">Detalles del producto:</h3>
      <p>${infoCard.description}</p>
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
