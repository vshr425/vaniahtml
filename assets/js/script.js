let productResponse = [];
let selectedCategories = [];
const productContainer = document.getElementById('product-container');
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
}
document.addEventListener('DOMContentLoaded', () => {    
    // Globle variables for store product data and selected category    
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.classList.add('shimmer');
    loadingIndicator.style.display = 'block';



    fetch('https://fakestoreapi.com/products')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(products => {
        productResponse = products;
        renderProduct(products);
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = 'Sorry, there was an error loading the products. Please try again later.';
        productContainer.appendChild(errorMessage);
    })
    .finally (
        () => {
            loadingIndicator.style.display = 'none';
            loadingIndicator.classList.remove('shimmer');
        }
    );
    
    document.getElementById('search-input').addEventListener('input', (event) => {
        currentSearchTerm = event.target.value;
        filterAndSearchProducts(selectedCategories, currentSearchTerm);
        
    });

});

   // Global variable to store the current search term
   let currentSearchTerm = '';

   const renderProduct = (products) => {
    productContainer.innerHTML = ''; // Clear existing product
    if (products.length === 0 ) {
        productContainer.innerHTML = '<p>No products found.</p>';
    }
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-details">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
            </div>
        `;

        productContainer.appendChild(productElement);
    });
}
    
   // filter and search products
   const filterAndSearchProducts = (categories, searchTerm) => {
       const filteredProducts = productResponse.filter(product => 
       (categories.length === 0 || categories.includes(product.category)) &&
       product.title.toLowerCase().includes(searchTerm.toLowerCase())
       );
       renderProduct(filteredProducts);
   };

    // Function to update selected categories when a checkbox is clicked
    const updateSelectedCategories = (checkbox) => {
        const category = checkbox.value;
        if (checkbox.checked) {
        // Add category to the selectedCategories array
        selectedCategories.push(category);
        } else {
        // Remove category from the selectedCategories array
        selectedCategories = selectedCategories.filter(cat => cat !== category);
        }
    
        // Call the filter function after updating categories
        filterAndSearchProducts(selectedCategories, currentSearchTerm);
    };


