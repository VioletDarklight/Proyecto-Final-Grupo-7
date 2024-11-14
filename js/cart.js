document.addEventListener("DOMContentLoaded", function () {
  let carritoVacio = document.getElementById("containerCarritoVacio");
  let carritoLLeno = document.getElementById("containerCarritoLleno");
  let finalcarrito = document.getElementById("finallity-table");
  let cartBadge = document.getElementById("cartBadge");

  // Función para actualizar el badge del carrito
  function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    let totalQuantity = cart.reduce((total, item) => total + item.quantity, 0); //Suma todas las cantidades de los items usando reduce
    cartBadge.textContent = totalQuantity || "0"; //Muestra la cantidad o "0" si el carrito está vacío
  }
  // Actualizar cuando cambie el localStorage en cualquier pestaña/ventana
  window.addEventListener("storage", function (e) {
    if (e.key === "shoppingCart") {
      updateCartBadge();
    }
  });

  // Ejecutar inmediatamente por si el DOM ya está cargado
  updateCartBadge();

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

    cartCompra.forEach((item, index) => {
      carritoLLeno.innerHTML += `<br>
       <br> 
      <div class="cartProducts">
        <table id="tablaCart" class="table table-borderless">
    <tr>
        <!-- Primera columna con el icono de basura y la imagen -->
        <th class="fixed-column" rowspan="5" style="padding: 0">
            <div class="icon-image-container ">
                <i class="bi bi-trash3-fill btn fa-lg" id="trashBtn-${index}"></i>
                <img class="cartImage" src="${item.image}">
            </div>
            
        </th>
        <!-- Columna con el nombre del producto encima de la cantidad -->
        <td class="nombreProd " style="padding: 0" colspan="3">${item.name}</td>
    </tr>
    <tr>
        <!-- Sección de cantidad con botones -->
        <td style="padding: 0;">Cantidad</td>
        <td class="td-cant" style="padding: 0">
            <button class="btn btn-cart menos" id="menos-${index}" type="button" style="padding: 0">
                <i class="bi bi-dash-circle" style="padding: 0"></i>
            </button>
            <input class="funcionalidad cajaCant" id="cajaCant" style="width:25px;text-align: center;padding: 0;" type="text" min="1" step="1" value="${
              item.quantity
            }" readonly>
            <button class="btn btn-cart mas" id="mas-${index}" type="button" style="padding: 0">
                <i class="bi bi-plus-circle" style="padding: 0"></i>
            </button>
        </td>
    </tr>
    <tr>
        <td style="padding: 0">Moneda</td>
        <td colspan="2" style="padding: 0">${item.currency}</td>
    </tr>
    <tr>
        <td style="padding: 0">Costo</td>
        <td colspan="2" style="padding: 0">${item.cost}</td>
    </tr>
    <tr>
        <td style="padding: 0">Subtotal</td>
        <td class="subtotales" colspan="2" style="padding: 0">${subtotalCart(
          item.quantity,
          item.cost,
          item.currency
        )}</td>
    </tr>
</table>

      </div>
      
      `;

      //Evento para icono eliminar
      document
        .getElementById(`trashBtn-${index}`)
        .addEventListener("click", function () {
          removeItemFromCart(index);
        });
    });

    finalcarrito.innerHTML = `
          
        <br>
      <table id="tablaCart" class="table  table-borderless total-currency">
           <tr class="containter-btn-buy">
               
               <td rowspan="3" >
               <a class="btn btn-cartFinal btn-primary" onclick="showCostsContainer()" id="btnContinuarCompra" href="#transitionCost" role="button">CONTINUAR COMPRA</a>
               </td>
</tr>
                
               <tr class="section-buy ">
               <td>Moneda    </td>
               <td class="totalFin" >UYU</td>
                
               </tr>
                
              <tr class="section-buy ">

              <td >Subtotal</td>
              <td class="totalFin" id="sumaFinal"></td>
              </tr>
             </table>
         `;

    //Actualizar cantidad en el badge del carrito
    updateCartBadge();
    // Recalcular el total
    calcularTotal();
  }

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

  /*FUNCIÓN ELIMINAR*/
  function removeItemFromCart(index) {
    let carrito = JSON.parse(localStorage.getItem("shoppingCart"));
    carrito.splice(index, 1); // Eliminar el elemento en la posición index
    localStorage.setItem("shoppingCart", JSON.stringify(carrito)); // Actualizar localStorage

    // Volver a mostrar el carrito actualizado
    if (carrito.length === 0) {
      localStorage.removeItem("shoppingCart"); // Eliminar el carrito si está vacío
      location.reload(); // Recargar la página para mostrar el mensaje de carrito vacío
    } else {
      showCart(carrito);
    }
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
      subtotales[index].textContent = subtotalCart(
        carrito[index].quantity,
        carrito[index].cost,
        carrito[index].currency
      );
    }

    // Guardar los cambios en localStorage
    localStorage.setItem("shoppingCart", JSON.stringify(carrito));

    // Actualizar el badge del carrito
    updateCartBadge();

    // Recalcular el total
    calcularTotal();
  }

  // Función para calcular el subtotal de un producto
  function subtotalCart(cant, cost, currency) {
    if (currency == "USD") return cant * (cost * 40);

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

    let total = carrito.reduce(
      (acc, item) => acc + item.quantity * item.cost,
      0
    );

    let sumaFinal = document.getElementById("sumaFinal");
    let subFinalAmount = document.getElementById("subFinalAmount");
    if (sumaFinal) {
      sumaFinal.textContent = total;
      subFinalAmount.textContent = total;
    }

    let opcionesEnvio = document.getElementsByName("cost");
    let tipoEnvio = 0;

    opcionesEnvio.forEach((opcion) => {
      if (opcion.checked) {
        tipoEnvio = obtenerPct(opcion.value);
      }
    });

    let costEnvio = document.getElementById("costFinalAmount");
    let totalFinalAmount = document.getElementById("totalFinalAmount");

    costEnvio.textContent = Math.round(total * tipoEnvio);
    totalFinalAmount.textContent =
      parseInt(total) + parseInt(costEnvio.textContent);
  }

  function obtenerPct(value) {
    if (value === "premium") {
      return 0.15;
    }

    if (value === "express") {
      return 0.07;
    }

    if (value === "standard") {
      return 0.05;
    }
  }

  //Variables de costo de envio
  let costpremium = document.getElementById("cost-premium");
  let costexpress = document.getElementById("cost-express");
  let coststandard = document.getElementById("cost-standard");

  // Función para calcular el costo de envío basado en el radio button seleccionado
  function calcularCostoEnvio(value) {
    let subTotal = document.getElementById("subFinalAmount").textContent;
    let costEnvio = document.getElementById("costFinalAmount");
    let totalFinalAmount = document.getElementById("totalFinalAmount");

    //Dependiendo de cual detecte hará el calculo
    if (value === "premium") {
      costEnvio.textContent = Math.round(subTotal * 0.15);
    }
    if (value === "express") {
      costEnvio.textContent = Math.round(subTotal * 0.07);
    }
    if (value === "standard") {
      costEnvio.textContent = Math.round(subTotal * 0.05);
    }
    //Suma los valores para obtener el total, parseInt convierte los valores en texto y los muestra en pantalla
    totalFinalAmount.textContent =
      parseInt(subTotal) + parseInt(costEnvio.textContent);
  }
  //Evento click para detectar y activa la funcion para ver cual es el costo según lo seleccionado en IF de arriba.
  costpremium.addEventListener("click", () => calcularCostoEnvio("premium"));
  costexpress.addEventListener("click", () => calcularCostoEnvio("express"));
  coststandard.addEventListener("click", () => calcularCostoEnvio("standard"));
});

//SECCIÓN COSTOS

//Función para ocultar botón "Continuar compra" al hacer click
function showCostsContainer() {
  let continuarCompra = document.getElementById("btnContinuarCompra");
  let seccionCostos = document.getElementById("container-costos");

  // Oculta el botón
  continuarCompra.style.display = "none";
  // Muestra el contenedor y aplica la transición
  seccionCostos.style.display = "block";
  setTimeout(() => {
    seccionCostos.classList.add("visible");
  }, 10); // Pausa para activar la transición
}

//Entrega 7 Punto 4
let containerPage = document.getElementById("cost-form");
// clases de inputs de direccion
let envioCost = document.getElementsByClassName("form-check-input"); // clases de los inputs de tipo de envio y forma de pago
let btnFinal = document.getElementById("btn-final-payment");
let provincias = document.getElementById("input-localidad");

// Creacion de evento click para el boton de finalizar compra

containerPage.addEventListener("submit", function (event) {
  //PARA EL METODO DE PAGO VALIDACION Y ALERTA
  if (!document.querySelector('input[name="cost"]:checked')) {
    let costoFin = document.getElementById("cFin");
    costoFin.innerHTML += `<div id="envios" class="alert alert-secondary alert-custom"   role="alert">
<p>Seleccione un tipo de envio,por favor</p></div>`;
    let envID = document.getElementById("envios");
    let envioFin = envID.parentNode;
    setTimeout(() => envioFin.removeChild(envID), 1000);
  } else if (!formularioCart()) {
    let insertAlert = document.getElementById("inicial");
    insertAlert.innerHTML += "";
    insertAlert.innerHTML += `<div id="form-tipotext" class="alert alert-secondary alert-custom" role="alert">
  <p>Complete todos los campos ,por favor</p>
</div>`;
    let miForm = document.getElementById("form-tipotext");
    let finalForm = miForm.parentNode;
    setTimeout(() => finalForm.removeChild(miForm), 1000);
  } else if (!document.querySelector('input[name="payment"]:checked')) {
    let ipt = document.getElementById("oni");
    ipt.innerHTML += `<div  id="alt" class="alert alert-secondary alert-custom" role="alert">
<p>Seleccione una forma de pago,por favor</p></div>`;
    let cont = document.getElementById("alt");
    let dentro = cont.parentNode;
    setTimeout(() => dentro.removeChild(cont), 1000);
  } else {
    let confirmationModal = new bootstrap.Modal(
      document.getElementById("confirmationModal")
    );
    confirmationModal.show();
  }
  event.preventDefault();
});

//funcion para validar campos de tipo texto y seleccion en el formulario
function formularioCart() {
  var inputs = document.querySelectorAll("input");
  var seleccion = document.querySelectorAll("select");
  let correct = true;
  // Recorre los inputs y al estar vacios devuelve falso
  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      console.log("Debe llenar todos los campos");
      correct = false;
    }
  });
  // Recorre los elementos select y al estar vacio devuelve falso
  seleccion.forEach((select) => {
    if (select.value === "") {
      console.log("Seleccione departamento");
      correct = false;
    }
  });
  return correct;
}

let usuarioCorreo = localStorage.getItem("username");
let contenedorCorreo = document.getElementById("email-final");
contenedorCorreo.innerText += ` ` + usuarioCorreo;

//Eventos para boton de cierre modal de compra final
let btnCarrito = document.getElementById("final-btn-carr");
btnCarrito.addEventListener("click", function () {
  localStorage.removeItem("shoppingCart");
  window.location = "categories.html";
});

let cierreModal = new bootstrap.Modal(
  document.getElementById("confirmationModal")
);
document
  .getElementById("confirmationModal")
  .addEventListener("hidden.bs.modal", function () {
    localStorage.removeItem("shoppingCart");
    location.reload();
  });

/*SECCIÓN OPCIONES DE PAGO*/
let paymentTarjeta = document.getElementById("paymentTarjeta");
let paymentEntrega = document.getElementById("paymentEntrega");
let deliveryPaymentSection = document.getElementById("deliveryPaymentSection");
let cardPaymentSection = document.getElementById("creditCardSection");

//Función para manejar la selección de opciones de pago
function handlePaymentSelection() {
  if (paymentTarjeta.checked) {
    cardPaymentSection.style.display = "flex";
    deliveryPaymentSection.style.display = "none";
  } else if (paymentEntrega.checked) {
    deliveryPaymentSection.style.display = "flex";
    cardPaymentSection.style.display = "none";
  } else {
    deliveryPaymentSection.style.display = "none";
    cardPaymentSection.style.display = "none";
  }
}

//Eventos para los cambios de opción de pago
paymentEntrega.addEventListener("change", handlePaymentSelection);
paymentTarjeta.addEventListener("change", handlePaymentSelection);
