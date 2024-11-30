const CATEGORIES_URL = "http://localhost:3000/categorias.json"; //CATEGORIAS
const PRODUCTS_URL = "http://localhost:3000/cat_prod/"; //CATEGORIAS SEGUN PRODUCTO AGREGAR ID
const PRODUCT_INFO_URL = "http://localhost:3000/productos/"; //INFO DE CADA PRODUCTO AGREGAR ID PRODUCTO
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/comentario_prod/"; //INFO PARA COMENTARIOS DE CADA PRODUCTO SEGUN PRODUCT
const CART_FULL = "http://localhost:3000/cart";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let token = localStorage.getItem("token");

var getJSONData = function (url) {
  var result = {};
  showSpinner();

  console.log("Token: ", token); //verificar si hay token

  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "access-token": token, //Envia el token en el encabezado
    },
  })
    .then((response) => {
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      if (response.ok) {
        return response.json();
      } else {
        // Leer el cuerpo del error para más detalles
        return response.text().then((text) => {
          console.error("Error response text:", text);
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${text}`
          );
        });
      }
    })

    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })

    .catch(function (error) {
      console.error("Fetch error:", error);
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

document.addEventListener("DOMContentLoaded", () => {
  let token = localStorage.getItem("token");
  let currentPage = window.location.pathname.split("/").pop(); //Se obtiene nombre del archivo actual
  const publicPages = ["login.html", "signup.html"]; //Paginas que no necesitan autenticacion

  if (!token && !publicPages.includes(currentPage)) {
    //Verifica si el usuario no esta autenticado y esta en una de las paginas que no necesita autenticacion
    window.location.href = "login.html?redirected=true"; //Redirige al login con indicador de redireccion
    return; //Detiene cualquier otra ejecucion
  }

  //Verificacion de validez del token con el backend

  if (token) {
    validateToken(token)
      .then((isValid) => {
        //Si el token no es valido, redirige al login
        if (!isValid && !publicPages.includes(currentPage)) {
          localStorage.removeItem("token"); //Elimina el token invalido
          window.location.href = "login.html?redirected=true";
        }
      })
      .catch((error) => {
        //Si hay un error, redirige al login
        console.error("Error al validar el token: ", error);
        localStorage.removeItem("token");
        window.location.href = "login.html?redirected=true";
      });
  }
});

//Funcion para validad el token con el backend
async function validateToken(token) {
  try {
    console.log("Validando token: ", token);

    const response = await fetch("http://localhost:3000/validate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": token, //Envia el token en el encabezado
      },
    });

    //Detalles completos de la respuesta
    console.log("Respuesta de validación de token:", {
      status: response.status,
      body: await response.text(),
    });

    //Si el backend devuelve un error el token no es valido
    return response.ok;
  } catch (error) {
    console.error("Error al validar token: ", error);
    return false;
  }
}
