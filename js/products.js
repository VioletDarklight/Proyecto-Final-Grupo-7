const AUTOS_URL = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

const contenedor = document.getElementById("pro-list-cont");


//funcion que realiza el recorrido en el ojeto JSON e impresion en pantalla del mismo.
function showAuto(array){
    for(const item of array){
        contenedor.innerHTML += `
        <div class = "col">
        <br>
       <div class= "container" style="width: 60%;">
<div id = "carta-img" class="card mb-3 shadow">
 <div>
  <img id= "img-carta" class=" img-fluid card-img-top rounded-top mx-auto d-block "  src="${item.image}"> </div>
 
  <div id = "carta-color" class = "rounded mx-auto row card-body" >
    <h2 class="card-title text-center" >${item.name}</h2>
    <p class=" card-text text-center car-description">${item.description}</p>
    <div class="d-flex justify-content-between px-3">
      <p class="card-text col-6 text-left card-text mb-0 ><small class="">${item.soldCount} unidades vendidas</small> </p>
      <p  class="card-text col-6 text-right card-text mb-0 car-cost" style= "width: 20%;">${item.cost} ${item.currency}</p>
    </div>
    <br>
  </div>
</div>
</div>
</div>`

    }
}
// Funcion para enviar los datos JSON al recorrido

function mostrarAuto() {

 fetch(AUTOS_URL)
 .then (response => response.json())
 .then(autos => {(autos.products)
    showAuto(autos.products)
 })
}

mostrarAuto();
