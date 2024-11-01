let carritoVacio = document.getElementById("containerCarritoVacio");
let carritoLLeno = document.getElementById("containerCarritoLleno");
let finalcarrito = document.getElementById("finallity-table");


// Carrito Vacío
if (!localStorage.getItem("shoppingCart")) {
  let div = document.getElementById("containerPrincipal");
  div.classList.remove("background");
  carritoVacio.innerHTML += `<div class="conjuntoCart"><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg><p class="carritoText"> Tu carrito está vacío! </p>
<a id="btn-cart" class="btn btn-primary" href="categories.html" role="button">Comenzá tu compra</a>
</div><br><div class="espacioCart"><br></div>`;
} else {
  let storageCarrito = JSON.parse(localStorage.getItem("shoppingCart"));
  let infoCarrito = [...storageCarrito];
  showCart(infoCarrito);
}

// Función para mostrar el carrito con productos
function showCart(cartCompra) {
  carritoLLeno.innerHTML = ""; // Limpiamos el contenido previo para evitar duplicados

  for (const item of cartCompra) {
    carritoLLeno.innerHTML += `<br>
       <br> 
      <div class="cartProducts">
        <table id="tablaCart" class="table table-borderless">
            <tr>
                <th class="nombreProd" colspan="4">${item.name}</th>
            </tr>
            <tr>
                <th rowspan="4"><img class="cartImage" src="${item.image}"></th>
                <td>Cantidad</td>
                <td>
                    <button class="btn btn-cart menos" id="menos" type="button">
                        <i class="bi bi-dash-circle"></i>
                    </button>
                </td>
                <td><input class="funcionalidad cajaCant" id="cajaCant" style="width:25px;text-align: center;" type="text" min="1" step="1" value="${item.quantity
      }" readonly></td>
                <td>
                    <button class="btn btn-cart mas" id="mas" type="button">
                        <i class="bi bi-plus-circle"></i>
                    </button>
                </td>
            </tr>
            <tr>
                <td>Moneda</td>
                <td colspan="2">${item.currency}</td>
            </tr>
            <tr>
                <td>Costo</td>
                <td colspan="2">${item.cost}</td>
            </tr>
            <tr>
                <td>Subtotal </td>
                <td class="subtotales" colspan="2">${subtotalCart(item.quantity,item.cost, item.currency)}</td>
            </tr>
        </table>
      </div>`;
  }

  finalcarrito.innerHTML = `
          
        <br>
      <table id="tablaCart" class="table  table-borderless">
           
               <tr>
               <td rowspan="3"><a class="btn btn-cartFinal btn-primary" href="compra.html" role="button">COMPRAR</a></td>
</td>
                
               </tr>
               <tr>
               <td>Moneda</td>
               <td >UYU</td>
                
               </tr>
                
              <tr id=>
              <td >TOTAL </td>
              <td class="totalFin" id="sumaFinal"> </td>
              <td></td>
              <td></td>
              </tr>
              
             </table>
         `;

  // Actualizar cantidad
  let botonesMas = document.getElementsByClassName("mas");
  let botonesMenos = document.getElementsByClassName("menos");
  let cajasCant = document.getElementsByClassName("cajaCant");

  for (let i = 0; i < botonesMas.length; i++) {
    botonesMas[i].addEventListener("click", function () {
      actualizarCantidad(i, 1);
      cajasCant[i].value = JSON.parse(localStorage.getItem("shoppingCart"))[
        i
      ].quantity;
    });
    botonesMenos[i].addEventListener("click", function () {
      actualizarCantidad(i, -1);
      cajasCant[i].value = JSON.parse(localStorage.getItem("shoppingCart"))[
        i
      ].quantity;
    });
  }

  // Recalcular el total
  calcularTotal();
}

// Función para actualizar la cantidad y guardar en localStorage
function actualizarCantidad(index, cambio) {
  let carrito = JSON.parse(localStorage.getItem("shoppingCart"));

  // Verifica si el índice es válido
  if (index < 0 || index >= carrito.length) return;

  // Actualizar cantidad
  carrito[index].quantity = Math.max(1, carrito[index].quantity + cambio);

  // Actualizar el subtotal
  let subtotales = document.getElementsByClassName("subtotales");
  if (subtotales[index]) {
    subtotales[index].textContent = subtotalCart(carrito[index].quantity, carrito[index].cost, carrito[index].currency);
  }

  // Guardar los cambios en localStorage
  localStorage.setItem("shoppingCart", JSON.stringify(carrito));

  // Recalcular el total
  calcularTotal();
}

// Función para calcular el subtotal de un producto
function subtotalCart(cant, cost, currency) {
  console.info("La cantidad es " + cant + " con un costo de " + cost + " con la moneda de " + currency);

  if (currency == 'USD')
    return cant * (cost * 40)

  return cant * cost;
}

// Función para calcular el total de todos los productos
function calcularTotal() {
  let carrito = JSON.parse(localStorage.getItem("shoppingCart"));
  if (!carrito) return;

  carrito.forEach((element) => {
    if (element.currency == "USD") {
      element.cost = element.cost * 40;
    }
  });

  let total = carrito.reduce((acc, item) => acc + item.quantity * item.cost, 0);

  let sumaFinal = document.getElementById("sumaFinal");
  if (sumaFinal) {
    sumaFinal.textContent = total;
  }
}