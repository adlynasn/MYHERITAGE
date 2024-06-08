document.addEventListener("DOMContentLoaded", async function() {
  const tableBody = document.querySelector("table tbody");
  const cartTotalElement = document.getElementById("cart-total");
  const cartSubtotalElement = document.getElementById("cart-subtotal");

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

  function displayCartItems(items) {
      tableBody.innerHTML = ''; // Clear existing rows

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

  await fetchCartData(); // Fetch the cart data and display it
});
