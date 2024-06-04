document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("table tbody");
    const cartTotalElement = document.getElementById("cart-total"); // Main "Total"
    const cartSubtotalElement = document.getElementById("cart-subtotal"); // "Subtotal"

    // Function to update total price in a specific row
    function updateRowTotal(row) {
        const priceCell = row.querySelector("td:nth-child(3)"); // Price cell
        const quantityInput = row.querySelector("input#product-quantity"); // Quantity input
        const totalCell = row.querySelector("td:nth-child(5)"); // Row's total cell
        
        const price = parseFloat(priceCell.textContent.replace("RM", "").trim());
        const quantity = parseInt(quantityInput.value, 10);

        const rowTotal = price * quantity;
        totalCell.textContent = "RM" + rowTotal.toFixed(2); // Update the row total
    }

    // Function to recalculate the total for the whole cart
    function recalculateCartTotal() {
        let cartTotal = 0;

        // Add up the totals from each row
        tableBody.querySelectorAll("tr").forEach((row) => {
            const totalCell = row.querySelector("td:nth-child(5)"); // Total cell in each row
            const rowTotal = parseFloat(totalCell.textContent.replace("RM", "").trim());
            cartTotal += rowTotal;
        });

        // Fixed fee/charge to be added
        const additionalFee = 8.00; // Fixed additional fee (RM 8.00)

        // Update the "Subtotal" in the given HTML snippet
        if (cartSubtotalElement) {
            cartSubtotalElement.textContent = `RM${cartTotal.toFixed(2)}`;
        }

        // Update the "Total" to include the additional fee
        if (cartTotalElement) {
            const total = cartTotal + additionalFee;
            cartTotalElement.textContent = `Total: RM${total.toFixed(2)}`; // Add the extra RM 8.00
        }
    }

    // Attach click event to each increase and decrease button
    document.querySelectorAll(".input-group .btn").forEach((button) => {
        button.addEventListener("click", function () {
            const row = button.closest("tr");
            const quantityInput = row.querySelector("input#product-quantity");

            let quantity = parseInt(quantityInput.value, 10);

            if (button.id === "increase-btn") {
                quantity++; // Increment
            } else if (button.id === "decrease-btn" && quantity > 1) {
                quantity--; // Decrement if greater than 1
            }

            // Update the quantity and total
            quantityInput.value = quantity; // Set the new quantity
            updateRowTotal(row); // Update the row total
            recalculateCartTotal(); // Recalculate total cart value
        });
    });

    // Event listener for manual quantity input changes
    document.querySelectorAll("input#product-quantity").forEach((input) => {
        input.addEventListener("change", function () {
            const row = input.closest("tr");
            updateRowTotal(row); // Update the row total
            recalculateCartTotal(); // Recalculate total cart value
        });
    });

    // Attach click event to each remove button
    document.querySelectorAll("#remove-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const row = button.closest("tr");
            tableBody.removeChild(row); // Remove the row
            
            recalculateCartTotal(); // Recalculate total cart value
            checkCartStatus(); // Check if cart is empty
        });
    });

    // Check initial cart status to ensure "No items in cart" message if needed
    function checkCartStatus() {
        const tbody = document.querySelector('table tbody');
        if (tbody.children.length === 0) {
            const noItemsRow = document.createElement("tr");
            const noItemsCell = document.createElement("td");
            noItemsCell.colSpan = 6; // Adjust if needed
            noItemsCell.textAlign = "center";
            noItemsCell.textContent = "No items in cart";
            noItemsRow.appendChild(noItemsCell);
            tbody.appendChild(noItemsRow);
        }
    }

    // Initial update for all rows
    document.querySelectorAll("table tbody tr").forEach((row) => {
        updateRowTotal(row); // Initialize row totals
    });
    recalculateCartTotal(); // Recalculate the cart total
    checkCartStatus(); // Check initial cart status
});

document.addEventListener("DOMContentLoaded", async function() {
  try {
    const response = await fetch("/cart");
    const responseData = await response.json();

    if (response.ok) {
      if (responseData.success) {
        const cartData = responseData.cart;
        displayCartItems(cartData.items);
        updateCartTotal(cartData.items);
      } else {
        console.error("Error fetching cart:", responseData.message);
      }
    } else {
      console.error("Error fetching cart:", responseData.message);
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
});



function displayCartItems(items) {
  const tbody = document.getElementById('cart-items');
  tbody.innerHTML = ''; // Clear existing rows

  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <th scope="row">
        <div class="d-flex align-items-center">
          <img src="${item.image}" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px" alt="${item.productName}" />
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
    tbody.appendChild(row);
  });
}

function updateCartTotal(items) {
  let subtotal = 0;

  items.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const shipping = 8.00; // Flat rate shipping
  const total = subtotal + shipping;

  document.getElementById('cart-subtotal').textContent = `RM${subtotal.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `RM${total.toFixed(2)}`;
}

