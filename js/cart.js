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
            <button class="btn btn-cart menos" data-index="${index} type="button" style="padding: 0">
                <i class="bi bi-dash-circle" style="padding: 0"></i>
            </button>
            <input class="funcionalidad cajaCant" id="cajaCant-${index}" style="width:25px;text-align: center;padding: 0;" type="text" min="1" step="1" value="${
        item.quantity
      }" readonly>
            <button class="btn btn-cart mas" data-index="${index}" type="button" style="padding: 0">
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
    // Volver a asignar los eventos a los botones de eliminar
    setupDeleteButtons();
    //Configurar los eventos de los botones de cantidades
    setupQuantityButtons();
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

  /*Evento botón eliminar*/
  function setupDeleteButtons() {
    // Seleccionamos todos los botones de basura
    let trashBtns = document.querySelectorAll(".bi-trash3-fill");

    trashBtns.forEach((btn) => {
      let index = btn.id.split("-")[1]; // Obtiene el índice a partir del id 'trashBtn-{index}'

      //Evento de eliminar
      btn.addEventListener("click", function () {
        removeItemFromCart(index);
      });
    });
  }
  let carrito = JSON.parse(localStorage.getItem("shoppingCart"));
  if (carrito) {
    showCart(carrito);
  }

  // Función para configurar los eventos de los botones de cantidad
  function setupQuantityButtons() {
    let botonesMas = document.getElementsByClassName("mas");
    let botonesMenos = document.getElementsByClassName("menos");

    //Evento botones de mas
    Array.from(botonesMas).forEach((boton) => {
      boton.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        actualizarCantidad(parseInt(index), 1);
        let finalButton = document.getElementById("nav-carrito");
        finalButton.classList.add("animate__animated", "animate__bounce");
        setTimeout(() => {
          finalButton.classList.remove("animate__bounce");
        }, 1000);
        let buttonAnimate = document.getElementById("sumaFinal");
        buttonAnimate.classList.add("animate__animated", "animate__heartBeat");
        setTimeout(() => {
          buttonAnimate.classList.remove("animate__heartBeat");
        }, 1000);
      });
    });

    // Evento botones de menos
    Array.from(botonesMenos).forEach((boton) => {
      boton.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        actualizarCantidad(parseInt(index), -1);
        let carritoFinal = document.getElementById("nav-carrito");
        carritoFinal.classList.add("animate__animated", "animate__bounce");
        setTimeout(() => {
          carritoFinal.classList.remove("animate__bounce");
        }, 1000);
        let buttonHeart = document.getElementById("sumaFinal");
        buttonHeart.classList.add("animate__animated", "animate__heartBeat");
        setTimeout(() => {
          buttonHeart.classList.remove("animate__heartBeat");
        }, 1000);
      });
    });
  }

  // Función para actualizar la cantidad
  function actualizarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem("shoppingCart"));

    // Verifica si el índice es válido
    if (index < 0 || index >= carrito.length) return;

    // Actualizar cantidad (mínimo 1)
    carrito[index].quantity = Math.max(1, carrito[index].quantity + cambio);

    // Actualizar el input de cantidad
    const inputCantidad = document.getElementById(`cajaCant-${index}`);
    if (inputCantidad) {
      inputCantidad.value = carrito[index].quantity;
    }

    // Actualizar el subtotal
    const subtotales = document.getElementsByClassName("subtotales");
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
 // clases de los inputs de tipo de envio y forma de pago
let btnFinal = document.getElementById("btn-final-payment");




// Creacion de evento click para el boton de finalizar compra

containerPage.addEventListener("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  //PARA EL METODO DE PAGO VALIDACION Y ALERTA
  //PARA EL METODO DE PAGO VALIDACION Y ALERTA
  
  //PRODUCTOS DE LA ORDENES
 
  //ORDENES

  if (!validateOpt()&&!validateText()) {
    const middleOfPage = document.body.scrollHeight/3;
    window.scrollTo({
      top: middleOfPage, // Desplazarse al medio de la página
      behavior: 'smooth'  // Desplazamiento suave
    });
    event.preventDefault();
  }
  else if(!validateText()){
    const mdDep = document.body.scrollHeight/3;
    window.scrollTo({
      top: mdDep, // Desplazarse al medio de la página
      behavior: 'smooth'  // Desplazamiento suave
    });
  }
  else if (!document.querySelector('input[name="payment"]:checked')){
    const midpage = document.body.scrollHeight/3;
    window.scrollTo({
      top: midpage, // Desplazarse al medio de la página
      behavior: 'smooth'  // Desplazamiento suave
    });mostrarAlertaMetod();
  }
  else if(!formularioTarjeta()&&cardPaymentSection.classList.contains("show")){
    const midtar = document.body.scrollHeight/2;
    window.scrollTo({
      top: midtar, // Desplazarse al medio de la página
      behavior: 'smooth'  // Desplazamiento suave 
    });
  }
   else if (
    (!document.querySelector('input[name="paymentDelivery"]:checked')&& deliveryPaymentSection.classList.contains("show"))
  ) {
    const midtar = document.body.scrollHeight/2;
    window.scrollTo({
      top: midtar, // Desplazarse al medio de la página
      behavior: 'smooth'  // Desplazamiento suave 
    });
    alertContra();
  }
   else { 
    let confirmationModal = new bootstrap.Modal(
      document.getElementById("confirmationModal")
    );
    confirmationModal.show();
let radioPay = document.querySelector('input[name="payment"]:checked').value;
let radioSel = document.querySelector('input[name="cost"]:checked').value;
let provincias = document.getElementById("input-localidad")
const selectedTexto = provincias.options[provincias.selectedIndex].text;
let localidad = document.getElementById("local").textContent;
let calle =document.getElementById("calle")
let nro =document.getElementById("nro")
let apto =document.getElementById("apt")
let esquina =document.getElementById("esq")
let sub_total = document.getElementById("subFinalAmount").textContent
let costo_envio= document.getElementById("costFinalAmount").textContent
let total=document.getElementById("totalFinalAmount").textContent
let productos = JSON.parse(localStorage.getItem("shoppingCart"))||"[]";
let order = {
        tipo_envio: radioSel,
        departamento: selectedTexto,
        localidad: localidad,
        calle: calle.value,
        nro: nro.value,
        apto: apto.value,
        esquina: esquina.value,
        forma_pago: radioPay,
        sub_total: parseFloat(sub_total),
        costo_envio: parseFloat(costo_envio),
        total: parseFloat(total),
        products:productos
      };
  

    fetch(CART_FULL,{
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Compra realizada por: ', data);
        alert('Compra exitosa');
    })
    .catch(error => {
        console.error('Error:', error);
    });

   
  }
  
});

//funcion para option select de departamento
let optionDep = document.querySelectorAll(".confirmar-form-select");
let selectionOpt = document.getElementById("input-localidad")
function validateOpt() {
  let isValid = true;
  Array.from(optionDep).forEach((option) => {
    if (option.value==="") {
      selectionOpt.classList.add("is-invalid");
      selectionOpt.classList.remove("is-valid");
      isValid = false; // Si hay algún input inválido, cambia isValid a false
    } else {
      selectionOpt.classList.add("is-valid");
      selectionOpt.classList.remove("is-invalid");
    }

    option.addEventListener("select", realTimeValid);
  });
  return isValid;
}


//funcion para inputs domicilio
let inputValue=document.querySelectorAll(".confirmar-formulario");

function validateText() {
  let isValid = true;
  Array.from(inputValue).forEach((input) => {
    if (!input.checkValidity()) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      isValid = false; // Si hay algún input inválido, cambia isValid a false
    } else {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    }
    input.addEventListener("input", realTimeValid);
  });
  return isValid;
}
//funcion para validar tarjeta cuando este desplegada 
 let datosTarget = document.querySelectorAll(".card-control-on");

function formularioTarjeta() {
 
  let isValid = true;

  if(cardPaymentSection.classList.contains("show")){
    Array.from(datosTarget).forEach((input) => {
      if (!input.checkValidity()) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        isValid = false; // Si hay algún input inválido, cambia isValid a false
      } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
      }
      input.addEventListener("input", realTimeValid);
    });
    return isValid;
}}
//funcion para validar cuotas de tarjeta desplegada
let optionCta = document.querySelectorAll(".card-control");
let selectionCta = document.getElementById("installments")
function validateCta() {
  let isValid = true;
  if(cardPaymentSection.classList.contains("show")){
  Array.from(optionCta).forEach((selectionCta) => {
    if (option.value==="0") {
      selectionCta.classList.add("is-invalid");
      selectionCta.classList.remove("is-valid");
      isValid = false; // Si hay algún input inválido, cambia isValid a false
    } else {
      selectionCta.classList.add("is-valid");
      selectionCta.classList.remove("is-invalid");
    }

    option.addEventListener("selectionCta", realTimeValid);
  });
  return isValid;
}}

function realTimeValid(event) {
  if (event.target.checkValidity()) {
    event.target.classList.add("is-valid");
    event.target.classList.remove("is-invalid");
  } else {
    event.target.classList.add("is-invalid");
    event.target.classList.remove("is-valid");
  }
}

// Activar inicialmente la validación en tiempo real en los inputs y option del formulario
Array.from(inputValue).forEach((input) => {
  input.addEventListener("input", realTimeValid);
});
Array.from(optionDep).forEach((option) => {
  option.addEventListener("change", realTimeValid);
});
Array.from(inputValue).forEach((input) => {
  input.addEventListener("input", realTimeValid);
});

//Muestra el correo en el modal
let usuarioCorreo = localStorage.getItem("username");
let contenedorCorreo = document.getElementById("email-final");
contenedorCorreo.innerText += ` ` + usuarioCorreo;

//Eventos para boton para redireccionar a categories o cerrar el modal borrando todo el carrito
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
  // Ocultar ambas secciones al principio
  deliveryPaymentSection.classList.remove("show");
  cardPaymentSection.classList.remove("show");

  // Mostrar la sección correspondiente con la animación
  if (paymentTarjeta.checked) {
    cardPaymentSection.classList.add("show");
  } else if (paymentEntrega.checked) {
    deliveryPaymentSection.classList.add("show");
  }
}

//Eventos para los cambios de opción de pago
paymentEntrega.addEventListener("change", handlePaymentSelection);
paymentTarjeta.addEventListener("change", handlePaymentSelection);
handlePaymentSelection();

//Funcion validadora de opcion de pago Tarjeta de credito
function formularioTarget() {
  var datosTarget = document.querySelectorAll(".card-control");
  var cuotas = document.querySelectorAll(".card-control-target");
  let correct = true;

  if (cardPaymentSection.classList.contains("show")) {
    // Recorre los inputs y al estar vacios devuelve falso
    datosTarget.forEach((datos) => {
      if (datos.value.trim() === "") {
        console.log("Debe llenar todos los campos");
        correct = false;
      }
    });
    // Recorre los elementos select y al estar vacio devuelve falso
    cuotas.forEach((cuota) => {
      if (cuota.value === "") {
        console.log("Seleccione cuotas");
        correct = false;
      }
    });
  }
  return correct;
}

//Funciones de las distintas alertas para cada campo a llenar
function mostrarAlertaMetod() {
  let alertaMetodo = document.createElement("div");
  alertaMetodo.innerHTML += `<div  id="alt" class="alert alert-secondary alert-custom" role="alert">
<p>Seleccione una forma de pago, por favor</p></div>`;
  document.body.appendChild(alertaMetodo);
  setTimeout(() => {
    alertaMetodo.remove();
  }, 1000);
}

function alertContra() {
  let alertaEntrega = document.createElement("div");
  alertaEntrega.innerHTML += `<div  id="mostrarPrimero" class="alert alert-secondary alert-custom" role="alert">
<p>Seleccione un metodo de pago, por favor</p></div>`;
  document.body.appendChild(alertaEntrega);
  setTimeout(() => {
    alertaEntrega.remove();
  }, 1000);
}
