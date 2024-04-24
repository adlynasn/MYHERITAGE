let products = {
  data: [
    {
      productName: "Aksara Batik",
      category: "Textile",
      price: "50",
      image: "media/heroPattern.png",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
    {
      productName: "Tea Set Tray",
      category: "Pottery",
      price: "40",
      image: "media/pottery1.jpg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
    {
      productName: "Coffee Rack",
      category: "Woodcraft",
      price: "50",
      image: "media/woodcraft1.webp",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
    {
      productName: "Armenian fruits abstract painting",
      category: "Painting",
      price: "30",
      image: "media/painting1.avif",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
    {
      productName: "Abstract Ceramic Sculpture",
      category: "Sculpture",
      price: "100",
      image: "media/sculpture.avif",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
    {
      productName: "Printed Batik Cotton",
      category: "Textile",
      price: "50",
      image: "media/printedbatik.jpg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
    {
      productName: "Rice Bowl",
      category: "Pottery",
      price: "45",
      image: "media/pottery2.jpg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
  ],
};
for (let i of products.data) {
  // Create Card
  let card = document.createElement("div");
  // Card should have category and should stay hidden initially
  card.classList.add("card", i.category, "hide");
  // Image div
  let imgContainer = document.createElement("div");
  imgContainer.classList.add("image-container");
  // Img tag
  let image = document.createElement("img");
  image.setAttribute("src", i.image);
  imgContainer.appendChild(image);
  card.appendChild(imgContainer);
  // Container
  let container = document.createElement("div");
  container.classList.add("container");

  // Product name
  let name = document.createElement("h5");
  name.classList.add("product-name");
  name.innerText = i.productName.toUpperCase();
  container.appendChild(name);
  //description
  let description = document.createElement("p");
  description.innerText = i.description;
  container.appendChild(description);
  // Price
  let price = document.createElement("h6");
  price.innerText = "RM" + i.price;
  container.appendChild(price);
  
  //add-to card button
  let button = document.createElement("button");
  button.classList.add("add-to-cart");
  button.innerText = "Add to cart";
  container.appendChild(button);
  
  card.appendChild(container);

  // Append anchor tag to the card
  let anchor = document.createElement("a");
  anchor.setAttribute("href", "singularproduct.html"); // Replace "product_details.html" with the URL of your product details page
  anchor.style.display = "block"; // Set display property to block
  anchor.appendChild(card); // Append the card to the anchor tag
  document.getElementById("products").appendChild(anchor);
}


//parameter passes from button(same as category)
function filterProduct(value) {
  //Button class code
  let buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => {
    //check if value equals innnerText
    if (value.toUpperCase() === button.innerText.toUpperCase()) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  //select all cards
  let elements = document.querySelectorAll(".card");
  elements.forEach((element) => {
    if (value === "all") {
      element.classList.remove("hide");
    } else {
      if (element.classList.contains(value)) {
        element.classList.remove("hide");
      } else {
        //hide other elements
        element.classList.add("hide");
      }
    }
  });

  // Display products after filtering
}

//Search button click=>
document.getElementById("search").addEventListener("click", () => {
  let searchInput = document
    .getElementById("search-input")
    .value.trim()
    .toUpperCase();
  let elements = document.querySelectorAll(".product-name");
  let cards = document.querySelectorAll(".card");

  if (searchInput === "") {
    // If search input is empty, display all products
    cards.forEach((card) => {
      card.classList.remove("hide");
    });
  } else {
    elements.forEach((element, index) => {
      // Check if text includes the search value
      if (element.innerText.toUpperCase().includes(searchInput)) {
        cards[index].classList.remove("hide");
      } else {
        // Hide others
        cards[index].classList.add("hide");
      }
    });
  }
});

//initial display all products
window.onload = () => {
  filterProduct("all");
};
const productsData = products.data;

const sortByPrice = () => {
  productsData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  displayProducts(productsData);
};
const sortByAlphabet = () => {
  productsData.sort((a, b) => a.productName.localeCompare(b.productName));
  displayProducts(productsData);
};
const displayProducts = (products) => {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = ""; // Clear previous products
  products.forEach((product) => {
    // Create product card container
    const card = document.createElement("div");
    card.classList.add("card");

    // Product image
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("image-container");
    const image = document.createElement("img");
    image.src = product.image;
    imgContainer.appendChild(image);
    card.appendChild(imgContainer);

    // Product details
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("details-container");
    const productName = document.createElement("h3");
    productName.textContent = product.productName;
    const price = document.createElement("p");
    price.textContent = "RM " + product.price;
    const description = document.createElement("p");
    description.textContent = product.description;
    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Add to Cart";
    addToCartButton.classList.add("add-to-cart");
    detailsContainer.appendChild(productName);
    detailsContainer.appendChild(description);
    detailsContainer.appendChild(price);
    detailsContainer.appendChild(addToCartButton);
    card.appendChild(detailsContainer);

    // Add to Cart button

    // Append card to products container
    productsContainer.appendChild(card);
  });
};

// Attach event listeners to the select element
const selectElement = document.getElementById("fruits");
selectElement.addEventListener("change", () => {
  const selectedOption = selectElement.value;
  if (selectedOption === "opel") {
    sortByPrice();
  } else if (selectedOption === "audi") {
    sortByAlphabet();
  }
});
const rangeInput = document.getElementById("rangeInput");
rangeInput.addEventListener("input", () => {
  const selectedPrice = parseInt(rangeInput.value);
  filterByPrice(selectedPrice);
});

// Function to filter products by price
const filterByPrice = (selectedPrice) => {
  const filteredProducts = productsData.filter(
    (product) => parseInt(product.price) <= selectedPrice
  );
  displayProducts(filteredProducts);
};
