let PRODUCTS_BASE_URL = 'https://japceibal.github.io/emercado-api/cats_products/101.json';
let productId = localStorage.getItem('selectedProductId');

if (productId) {
    let productInfoUrl = `${PRODUCTS_BASE_URL}${productId}.json`;

    fetch(productInfoUrl)
        .then(response => response.json())
        .then(data => {
            let product = data;  
            let container = document.getElementById('detalles-producto');
            let images = product.images.map(imageUrl => `<img src="${imageUrl}" class="img-fluid img-thumbnail" alt="${product.name}">`).join('');

            container.innerHTML = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>Categoría:</strong> ${product.category}</p>
                        <p class="card-text"><small class="text-muted">${product.soldCount} vendidos</small></p>
                    </div>
                    <div class="card-body">
                        <h5>Imágenes del producto</h5>
                        <div class="d-flex flex-wrap">
                            ${images}
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error del producto:', error);
        });
} else {
    console.error('No se encontró el producto.');
}
