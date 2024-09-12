let AUTOS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
let cat = localStorage.getItem("catID");
if (cat == null) {
  cat = 101;
}

// función para guardar el id del producto y redirigir
function setProdID(id) {
    localStorage.setItem("prodID", id);  // guarda el ID del producto en localStorage
    window.location = "product-info.html";  // redirige a la página de detalles del producto
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


function showData(array) {
    contenedor.innerHTML = ''; 

    for (const item of array) {
        let images = item.images.map(imageUrl => `
            <img class="img-fluid card-img-top rounded-top mx-auto d-block" src="${item.image}>
        `).join('');

        contenedor.innerHTML += `
            <div class="col">
                <div class="col-lg-12 card mb-3 shadow">
                    ${images}
                    <div class="rounded mx-auto row card-body">
                        <h2 class="card-title text-center">${item.name}</h2>
                        <p class="col-sm-12 card-text text-center">${item.description}</p>
                        
                        <div class="col-sm-12 col-lg-12 col-md-12 d-flex justify-content-between px-3">
                            <p class="card-text text-left mb-0">
                                <small>${item.soldCount} vendidas</small>
                            </p>
                            <p class="card-text mb-0">${item.cost} ${item.currency}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}


