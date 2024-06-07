document.addEventListener('DOMContentLoaded', () => {
    let products = [];
  
    // Fetch products initially
    fetchProducts();
  
    // Fetch featured products initially
    fetchFeaturedProducts();
  
    // Attach event listeners to category buttons
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        console.log('Selected category:', category); // Debugging log
        filterProducts(category);
      });
    });
  
    // Event listener for the price range input
    const rangeInput = document.getElementById('rangeInput');
    rangeInput.addEventListener('input', () => {
      const price = rangeInput.value;
      console.log('Selected price range:', price); // Debugging log
      fetchProductsByPriceRange(price);
    });
  
    // Event listener for the sorting select element
    const sortSelect = document.getElementById('fruits');
    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;
      console.log('Selected sorting option:', sortBy); // Debugging log
      sortProducts(sortBy);
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
    
  
    // Function to fetch products
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        products = data;
        console.log('Fetched products:', products); // Debugging log
        displayProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    // Function to fetch featured products
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/featured-products');
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched featured products:', data); // Debugging log
        displayFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    }
  
    // Function to fetch products based on the price range
    async function fetchProductsByPriceRange(maxPrice) {
      try {
        const response = await fetch(`/api/products?maxPrice=${maxPrice}`);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched products by price range:', data); // Debugging log
        displayProducts(data);
      } catch (error) {
        console.error('Error fetching products by price range:', error);
      }
    }
  
    function displayProducts(products) {
      const productsContainer = document.getElementById('products');
      console.log('Displaying products:', products); // Debugging log
  
      const productHtml = products.map(product => {
          // Use the imagePath directly from the product data
          let imagePath = '';
          if (product.imagePath) {
              imagePath = product.imagePath;
          } else {
              console.warn('Image path is missing for product:', product.name);
          }
  
          return `
              <div class="col-md-6 col-lg-6 col-xl-4">
                  <div class="rounded position-relative fruite-item">
                      <div class="fruite-img">
                          <img src="${imagePath}" class="img-fluid w-100 rounded-top" alt="${product.name}">
                      </div>
                      <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">
                          ${product.category ? product.category.name : 'Uncategorized'}
                      </div>
                      <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                          <h4><a href="singularproduct.html?id=${product._id}">${product.name}</a></h4>
                          <p>${product.description}</p>
                          <div class="d-flex justify-content-between flex-lg-wrap">
                              <p class="text-dark fs-5 fw-bold mb-0">RM${product.price}</p>
                              <a href="#" class="btn border border-secondary rounded-pill px-3 text-primary">
                                  <i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                              </a>
                          </div>
                      </div>
                  </div>
              </div>
          `;
      }).join('');
  
      productsContainer.innerHTML = productHtml;
  }
  
  
  
  
  
  
  

  
  function displayFeaturedProducts(productsArray) {
    const featuredProductsContainer = document.getElementById('featured-products');
    console.log('Displaying featured products:', productsArray); // Debugging log

    const featuredProductHtml = productsArray.map(product => {
        let imagePath = '';
        if (product.imagePath) {
            imagePath = product.imagePath;
        } else {
            console.warn('Image path is missing for product:', product.name);
            imagePath = 'path/to/default/image.jpg'; // Provide a fallback image
        }

        return `
            <a href="singularproduct.html?id=${product._id}" class="d-flex align-items-center justify-content-start text-decoration-none text-dark">
                <div class="rounded me-4" style="width: 100px; height: 100px;">
                    <img src="${imagePath}" class="img-fluid rounded" alt="${product.name}">
                </div>
                <div>
                    <h6 class="mb-2">${product.name}</h6>
                    <div class="d-flex mb-2">
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star"></i>
                    </div>
                    <div class="d-flex mb-2">
                        <h5 class="fw-bold me-2">RM${product.price}</h5>
                        ${product.originalPrice ? `<h5 class="text-danger text-decoration-line-through">RM${product.originalPrice}</h5>` : ''}
                    </div>
                </div>
            </a>
        `;
    }).join('');
    featuredProductsContainer.innerHTML = featuredProductHtml;
}


  
    // Function to sort products
    function sortProducts(sortBy) {
      if (!Array.isArray(products)) {
        console.error('Products is not an array:', products);
        return;
      }
  
      let sortedProducts = [...products]; // Create a copy of the products array to sort
  
      if (sortBy === 'Price') {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'Alphabet') {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      }
  
      console.log('Sorted products:', sortedProducts); // Debugging log
      displayProducts(sortedProducts);
    }
  
    // Function to filter products by category
    function filterProducts(category) {
      let filteredProducts = [];
      if (category === 'All') {
        filteredProducts = products;
      } else {
        for (const product of products) {
          if (product.category && product.category.name === category) {
            filteredProducts.push(product);
          }
        }
      }
  
      console.log('Filtered products by category:', category, filteredProducts);
      displayProducts(filteredProducts);
    }
  });
  