let AUTOS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
let cat = localStorage.getItem("catID");
if (cat == null) {
  cat = 101;
}

const contenedor = document.getElementById("pro-list-cont");
const sortAscRadio = document.querySelector("#sortAsc");
const sortDescRadio = document.querySelector("#sortDesc");
const sortByCountRadio = document.querySelector("#sortByCount");
const rangeFilterMinInput = document.querySelector("#rangeFilterCountMin");
const rangeFilterMaxInput = document.querySelector("#rangeFilterCountMax");
const rangeFilterButton = document.querySelector("#rangeFilterCount");
const clearFilterButton = document.querySelector("#clearRangeFilter");

let dataArray = []; // Variable para almacenar los datos

// Función para mostrar los autos
function showData(array) {
  contenedor.innerHTML = ""; // Limpiar contenedor antes de mostrar los datos
  for (const item of array) {
    contenedor.innerHTML += `
        <div  class= "col">
      <div id = "carta-img" class="col-lg-12  card mb-3 shadow">
 
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
}
// Funcion para enviar los datos JSON al recorrido

function mostrarAuto() {
  fetch(AUTOS_URL + cat + ".json")
    .then((response) => response.json())
    .then((autos) => {
      autos.products;
      showAuto(autos.products);
    });
}

mostrarAuto();

// Función para ordenar los datos por precio de forma ascendente
function sortDataByPriceAsc() {
  dataArray.sort((a, b) => a.cost - b.cost);
  showData(dataArray);
}

// Función para ordenar los datos por precio de forma descendente
function sortDataByPriceDesc() {
  dataArray.sort((a, b) => b.cost - a.cost);
  showData(dataArray);
}

// Función para ordenar los datos por cantidad de vendidos
function sortDataBySoldCount() {
  dataArray.sort((a, b) => b.soldCount - a.soldCount);
  showData(dataArray);
}

// Función para filtrar por rango de precio
function filterByPriceRange(minPrice, maxPrice) {
  const filteredData = dataArray.filter((item) => {
    const itemPrice = item.cost;
    return (
      (minPrice === "" || itemPrice >= minPrice) &&
      (maxPrice === "" || itemPrice <= maxPrice)
    );
  });
  showData(filteredData);
}

// Eventos para los botones
rangeFilterButton.addEventListener("click", () => {
  const minPrice = rangeFilterMinInput.value;
  const maxPrice = rangeFilterMaxInput.value;
  filterByPriceRange(minPrice, maxPrice);
});

clearFilterButton.addEventListener("click", () => {
  rangeFilterMinInput.value = "";
  rangeFilterMaxInput.value = "";
  showData(dataArray); // Mostrar todos los productos al limpiar filtros
});

// Eventos para los botones de orden
sortAscRadio.addEventListener("click", () => {
  sortDataByPriceAsc(); // Ordenar por precio ascendente
});

sortDescRadio.addEventListener("click", () => {
  sortDataByPriceDesc(); // Ordenar por precio descendente
});

sortByCountRadio.addEventListener("click", () => {
  sortDataBySoldCount(); // Ordenar por cantidad de vendidos
});
