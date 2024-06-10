document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetchProductDetails(productId);
    } else {
        document.getElementById('product-detail').innerHTML = '<p>Product ID not found in URL.</p>';
    }
});

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const product = await response.json();
        displayProductDetails(product, productId); // Pass product ID to displayProductDetails
    } catch (error) {
        console.error('Error fetching product details:', error);
        document.getElementById('product-detail').innerHTML = '<p>Error fetching product details.</p>';
    }
}

function displayProductDetails(product, productId) {
    const imageElement = document.getElementById('mainImage');
    const productNameElement = document.getElementById('productName');
    const productPriceElement = document.getElementById('productPrice');
    const productDescriptionElement = document.getElementById('productDescription');
    const quantityInput = document.getElementById('quantityInput');
    const totalPrice = document.getElementById('totalPrice');
    const productStars = document.getElementById('productStars');
    const addToCartBtn = document.getElementById('addToCartBtn');

    // Set product image
    if (product.imagePath) {
        imageElement.src = product.imagePath;
    } else {
        console.warn('Image path is missing for product:', product.name);
        imageElement.src = 'path/to/default/image.jpg'; // Provide a fallback image
    }

    // Set product details
    productNameElement.innerText = product.name;
    productPriceElement.innerText = `RM${product.price}`;
    productDescriptionElement.innerText = product.description;

    // Update total price based on quantity input
    function updateTotalPrice() {
        const total = product.price * quantityInput.value;
        totalPrice.innerText = `RM${total.toFixed(2)}`;
    }

    quantityInput.addEventListener('input', updateTotalPrice);
    updateTotalPrice();

    // Update stars based on product rating
    productStars.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const starClass = i < product.rating ? 'fa-star' : 'fa-star-o';
        productStars.innerHTML += `<li><i class="fa ${starClass}"></i></li>`;
    }

    // Attach event listener to "Add to cart" button
    addToCartBtn.addEventListener('click', () => {
        const userId = "665de9438d48ef4b168eee50"; // Hardcoded userID

        // Call the function to add the product to the cart
        addToCart(userId, productId);
    });
}

  // Function to add a product to the cart
  async function addToCart(userId, productId) {
    try {
      const response = await fetch("/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: 1, // You can adjust the quantity as needed
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const responseData = await response.json();
      console.log("Response from server:", responseData); // Debugging log
      alert(responseData.message); // Display a message to the user
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Error adding item to cart. Please try again later."); // Display an error message to the user
    }
  }


