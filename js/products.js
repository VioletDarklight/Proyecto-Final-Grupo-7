const AUTOS_URL = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

const contenedor = document.getElementById("pro-list-cont");


//funcion que realiza el recorrido en el ojeto JSON e impresion en pantalla del mismo.
function showAuto(array){
    for(const item of array){
        contenedor.innerHTML += `
        <div class = "col">
        <br>
       <div class= "container" style="width: 70%;">
<div id = "carta-img" class="card mb-3">
 <div> <br>
  <img class="rounded mx-auto d-block" class="card-img-top" src="${item.image}"> </div>
  <br>
  <div id = "carta-color" class = "text-center" class = "rounded mx-auto d-block"  class="card-body">
    <h5 class="card-title" >${item.name}</h5>
    <p class="card-text">${item.description}</p>
    <p  class="card-text"><small class="text-muted">${item.cost} ${item.currency}</small> </p>
    <p class="card-text" ><small class="text-muted">${item.soldCount} unidades vendidas</small> </p>
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
