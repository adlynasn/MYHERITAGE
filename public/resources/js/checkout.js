document.addEventListener("DOMContentLoaded", async function() {
    const tableBody = document.querySelector("table tbody");
    const cartTotalElement = document.getElementById("cart-total");
    const cartSubtotalElement = document.getElementById("cart-subtotal");
    const userInfo = document.getElementById("user-information");

    async function fetchCartData() {
        try {
            const response = await fetch("/cart");
            const responseData = await response.json();

            if (response.ok) {
                if (responseData.success) {
                    const cartData = responseData.cart;
                    displayCartItems(cartData.items);
                    recalculateCartTotal();
                } else {
                    console.error("Error fetching cart:", responseData.message);
                }
            } else {
                console.error("Error fetching cart:", responseData.message);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    
    async function getUserData() {
        const userID = `665de9438d48ef4b168eee50`; // Replace this with an actual userID from your database
    
        try {
            const response = await fetch(`/getUser/${userID}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
            }
    
            const userData = await response.json();
            // Construct user information HTML
            const userInfoHTML = `
                <p><strong>Name:</strong> ${userData.firstname} ${userData.lastname}</p>
                <p><strong>Mobile:</strong> ${userData.mobile}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Address:</strong> ${userData.address}</p>
            `;
    
            // Update placeholder with user information
            userInfo.innerHTML = userInfoHTML;
        } catch (error) {
            console.error("Error fetching user data:", error);
            // Handle the error appropriately, such as displaying an error message to the user
        }
    }
    
    // Call the function to fetch user data
    getUserData();
  
    function displayCartItems(items) {
      tableBody.innerHTML = ''; // Clear existing rows
  
      items.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <th scope="row">
                  <div class="d-flex align-items-center">
                      <img src="${item.imagePath}" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px" alt="${item.productName}" />
                  </div>
              </th>
              <td>${item.productName}</td>
              <td>RM${item.price}</td>
              <td>
                  <div class="input-group" style="width: fit-content">
                      <div class="input-group-prepend">
                          <button class="btn small-button border" id="decrease-btn">
                              <i class="fa fa-minus small-icon"></i>
                          </button>
                      </div>
                      <input type="text" class="form-control-sm text-center" value="${item.quantity}" id="product-quantity" />
                      <div class="input-group-append">
                          <button class="btn small-button border" id="increase-btn">
                              <i class="fa fa-plus small-icon"></i>
                          </button>
                      </div>
                  </div>
              </td>
              <td>RM${item.price * item.quantity}</td>
              <td>
                  <button class="btn bg-light medium-button" id="remove-btn">
                      <i class="fa fa-times text-danger"></i>
                  </button>
              </td>
          `;
          tableBody.appendChild(row);
      });
  
      attachEventListeners(); // Attach event listeners after rendering the items
  }
  
  
    function updateRowTotal(row) {
        const priceCell = row.querySelector("td:nth-child(3)");
        const quantityInput = row.querySelector("input#product-quantity");
        const totalCell = row.querySelector("td:nth-child(5)");
  
        const price = parseFloat(priceCell.textContent.replace("RM", "").trim());
        const quantity = parseInt(quantityInput.value, 10);
  
        const rowTotal = price * quantity;
        totalCell.textContent = "RM" + rowTotal.toFixed(2);
    }
  
    function recalculateCartTotal() {
        let cartTotal = 0;
  
        tableBody.querySelectorAll("tr").forEach((row) => {
            const totalCell = row.querySelector("td:nth-child(5)");
            const rowTotal = parseFloat(totalCell.textContent.replace("RM", "").trim());
            cartTotal += rowTotal;
        });
  
        const additionalFee = 8.00;
        if (cartSubtotalElement) {
            cartSubtotalElement.textContent = `RM${cartTotal.toFixed(2)}`;
        }
  
        if (cartTotalElement) {
            const total = cartTotal + additionalFee;
            cartTotalElement.textContent = `Total: RM${total.toFixed(2)}`;
        }
    }
  
    function attachEventListeners() {
        document.querySelectorAll(".input-group .btn").forEach((button) => {
            button.addEventListener("click", function () {
                const row = button.closest("tr");
                const quantityInput = row.querySelector("input#product-quantity");
  
                let quantity = parseInt(quantityInput.value, 10);
  
                if (button.id === "increase-btn") {
                    quantity++;
                } else if (button.id === "decrease-btn" && quantity > 1) {
                    quantity--;
                }
  
                quantityInput.value = quantity;
                updateRowTotal(row);
                recalculateCartTotal();
            });
        });
  
        document.querySelectorAll("input#product-quantity").forEach((input) => {
            input.addEventListener("change", function () {
                const row = input.closest("tr");
                updateRowTotal(row);
                recalculateCartTotal();
            });
        });
  
        document.querySelectorAll("#remove-btn").forEach((button) => {
            button.addEventListener("click", function () {
                const row = button.closest("tr");
                tableBody.removeChild(row);
                recalculateCartTotal();
                checkCartStatus();
            });
        });
    }
  
    function checkCartStatus() {
        if (tableBody.children.length === 0) {
            const noItemsRow = document.createElement("tr");
            const noItemsCell = document.createElement("td");
            noItemsCell.colSpan = 6;
            noItemsCell.textAlign = "center";
            noItemsCell.textContent = "No items in cart";
            noItemsRow.appendChild(noItemsCell);
            tableBody.appendChild(noItemsRow);
        }
    }

    // JavaScript to handle unchecking behavior
    const radioButtons = document.querySelectorAll('.form-check-input');

    radioButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.checked) {
                radioButtons.forEach(otherButton => {
                    if (otherButton !== this) {
                        otherButton.checked = false;
                    }
                });
            } else {
                this.checked = true;
            }
        });
    });

     // Function to place the order
     async function placeOrder() {
        try {
            // Extract items from the cart table
            const cartItems = Array.from(tableBody.children).map(row => {
                const productName = row.querySelector("td:nth-child(2)").textContent;
                const price = parseFloat(row.querySelector("td:nth-child(3)").textContent.replace("RM", ""));
                const quantity = parseInt(row.querySelector("input#product-quantity").value, 10);
                return { productName, price, quantity };
            });

            // Construct the order data
            const orderData = {
                userID: "665de9438d48ef4b168eee50", // Hardcoded for now, replace with actual user ID
                items: cartItems,
            };

            // Send a POST request to create the order
            const response = await fetch("/api/order/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });

            // Check if the request was successful
            if (response.ok) {
                const responseData = await response.json();
                console.log("Order placed successfully:", responseData);
                // Optionally, you can redirect the user to a thank you page
                window.location.href = "thankyoupage.html";
            } else {
                const errorData = await response.json();
                throw new Error(`Failed to place order: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            // Handle the error appropriately, such as displaying an error message to the user
        }
    }

    // Add event listener to the "Place Order" button
    const placeOrderButton = document.querySelector(".btn.border-secondary");
    placeOrderButton.addEventListener("click", placeOrder);
  
    await fetchCartData(); // Fetch the cart data and display it
  });
  