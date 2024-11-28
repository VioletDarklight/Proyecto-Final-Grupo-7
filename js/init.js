const CATEGORIES_URL = "http://localhost:3000/categorias.json";//CATEGORIAS
const PRODUCTS_URL = "http://localhost:3000/cat_prod/"; //CATEGORIAS SEGUN PRODUCTO AGREGAR ID 
const PRODUCT_INFO_URL = "http://localhost:3000/productos/"; //INFO DE CADA PRODUCTO AGREGAR ID PRODUCTO
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/comentario_prod/"; //INFO PARA COMENTARIOS DE CADA PRODUCTO SEGUN PRODUCT
const CART_FULL = "http://localhost:3000/cart"

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var  result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}