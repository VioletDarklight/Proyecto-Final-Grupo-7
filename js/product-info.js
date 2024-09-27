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
      </div>
    
    `;
  }

  containerComm.innerHTML += `
  <p>
    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" id="btnNewComm">
      Agregar Comentario
    </button>
  </p>
  <div class="collapse" id="collapseExample">
    <div class="card card-body">
  <input type="text" class="cajadeescritura" placeholder="Escribe algo aquí...">
  <br>
  <p class="nombre-usuario">Your_User</p>
   <p id="display-time"></p>
   <br>
   <button class="btn btn-success" type="button" id="botonenviar"> ENVIAR </button>
    </div>
  </div>
    `;

  //Evento para desaparecer botón de nuevo comentario
  let btnNewComm = document.getElementById("btnNewComm");
  btnNewComm.addEventListener("click", () => {
    btnNewComm.remove();
  });

  // Función para mostrar la fecha y hora actual al escribir comentario
  function currentTime() {
    let currentDate = new Date();
    let formattedDate = formatDate(currentDate); //Le da el formato que usamos en los comentarios del json
    document.getElementById("display-time").innerText = formattedDate;
  }
  currentTime();
  //Actualizar la hora cada minuto
  setInterval(currentTime, 60000);
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

//Realizacion de fetch para obtener los datos que se encuentran dentro del json e Invocacion de funcion una vez obtenidos los mismos.
fetch(prodInfoURL)
  .then((response) => response.json())
  .then((infoRel) => {
    showRel(infoRel);
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
    <button  onclick="setProdID(${infoRel.relatedProducts[0].id})" class="ver-ver0" type="button">VER MAS</button>
  </div>
</div>
</div>

<div  class=" card-text carousel-item ">
  <div id="carta-rel" class="card " >
    <img  id="img-rel" src="${infoRel.relatedProducts[1].image}" class="card-img-top" alt="...">
    <div class="card-body card-button">
     <h5 class="card-title mod-titulo rel-name">${infoRel.relatedProducts[1].name}</h5>
     <button onclick="setProdID(${infoRel.relatedProducts[1].id})" class="ver-ver0" type="button">VER MAS</button>
    </div>
 </div>
</div>
  <button  class="carousel-control-prev h-50 button-rel" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev" >
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next h-50 button-rel" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
`;
}
//funcion que realiza la actualizacion el id del local storage al hacer clic en el boton(linea 147 y 137) del producto del que quiere saber mas informacion.
function setProdID(id) {
  localStorage.removeItem("prodID");
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
}
