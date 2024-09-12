let AUTOS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
let cat = localStorage.getItem("catID");
if (cat == null) {
  cat = 101;
}

// busca el id del producto en localStorage
const prodID = localStorage.getItem("prodID");

// encuentra los datos del producto
const prodInfoURL = "https://japceibal.github.io/emercado-api/products/" + prodID + ".json";
  
fetch(prodInfoURL) 
  .then((response) => response.json())
  .then((productData) => {
    showData(productData); 
  })
  .catch((error) => console.log("Error", error));


// función para mostrar los datos del producto
function showData(item) {
    const contenedor = document.getElementById("pro-list-cont");
    let images = item.images.map(imageUrl => `
        <img class="img-fluid card-img-top rounded-top mx-auto d-block" src="img/${imageUrl}" alt="${item.name}">
    `).join('');
  
    contenedor.innerHTML = `
       <div  class= "col">
      <div id = "carta-img" class="col-lg-12  card mb-3 shadow" onclick="setprodID(${item.id})">
 
        <img id= "img-carta" class="img-fluid card-img-top rounded-top mx-auto d-block "  src="${item.image}">
 
       <div  id = "carta-color" class = "rounded mx-auto row card-body" >
        <h2 class="card-title text-center" >${item.name}</h2>
        <p class=" col-sm-12 card-text text-center car-description">${item.description}</p>
        
        <br>
        
        <div class="col-sm-12 col-lg-12 col-md-12 d-flex justify-content-between px-3 ">
        <p class="card-text  car-uni text-left mb-0"><small class="">${item.soldCount} vendidas</small> </p>
        <br>
          <p class="card-text mb-0 car-cost"   >${item.cost} ${item.currency}</p>
          </div>
          <br>
      </div>
      </div>
    </div>`;
  }


