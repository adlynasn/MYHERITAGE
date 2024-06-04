document.addEventListener('DOMContentLoaded', () => {
  let products = [];

  // Fetch products initially
  fetchProducts();

  // Attach event listeners to category buttons
  const categoryButtons = document.querySelectorAll('.category-button');
  categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
          const category = button.getAttribute('data-category');
          console.log('Selected category:', category); // Debugging log
          filterProducts(products, category);
      });
  });

  // Event listener for the price range input
  const rangeInput = document.getElementById('rangeInput');
  rangeInput.addEventListener('input', () => {
      const price = rangeInput.value;
      console.log('Selected price range:', price); // Debugging log
      fetchProductsByPriceRange(price);
  });

  // Event listener for the search button
  document.getElementById('search').addEventListener('click', () => {
      const searchTerm = document.getElementById('search-input').value.toLowerCase();
      console.log('Search term:', searchTerm); // Debugging log
      const filteredProducts = products.filter(product => 
          (product.name && product.name.toLowerCase().includes(searchTerm)) ||
          (product.description && product.description.toLowerCase().includes(searchTerm)) ||
          (product.category && product.category.name && product.category.name.toLowerCase().includes(searchTerm))
      );
      console.log('Filtered products:', filteredProducts); // Debugging log
      displayProducts(filteredProducts);
  });

  // Function to fetch all products
  function fetchProducts() {
      fetch('/api/products')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.json();
          })
          .then(data => {
              products = data;
              console.log('Fetched products:', products); // Debugging log
              displayProducts(products);
          })
          .catch(error => console.error('Error fetching products:', error));
  }

  // Function to fetch products based on the price range
  async function fetchProductsByPriceRange(maxPrice) {
      try {
          const response = await fetch(`/api/products?maxPrice=${maxPrice}`);
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          const data = await response.json();
          console.log('Fetched products:', data); // Debugging log
          displayProducts(data);
      } catch (error) {
          console.error('Error fetching products:', error);
      }
  }

  // Function to display products
  function displayProducts(products) {
      const productsContainer = document.getElementById('products');
      console.log('Displaying products:', products); // Debugging log
      const productHtml = products.map(product => `
          <div class="col-md-6 col-lg-6 col-xl-4">
              <div class="rounded position-relative fruite-item">
                  <div class="fruite-img">
                      <img src="${product.image}" class="img-fluid w-100 rounded-top" alt="${product.name}">
                  </div>
                  <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">${product.category ? product.category.name : 'Uncategorized'}</div>
                  <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                      <h4>${product.name}</h4>
                      <p>${product.description}</p>
                      <div class="d-flex justify-content-between flex-lg-wrap">
                          <p class="text-dark fs-5 fw-bold mb-0">RM${product.price}</p>
                          <a href="#" class="btn border border-secondary rounded-pill px-3 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                      </div>
                  </div>
              </div>
          </div>
      `).join('');

      productsContainer.innerHTML = productHtml;
  }

  // Function to filter products by category
  function filterProducts(products, category) {
      let filteredProducts = [];
      if (category === 'All') {
          filteredProducts = products;
      } else {
          filteredProducts = products.filter(product => product.category && product.category.name === category);
      }

      console.log('Filtered products by category:', category, filteredProducts);
      displayProducts(filteredProducts);
  }
});
