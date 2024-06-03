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
            cartTotalElement.textContent = `Total: RM${(cartTotal + additionalFee).toFixed(2)}`; // Add the extra RM 8.00
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
        if (tableBody.children.length === 0) {
            const noItemsRow = document.createElement("tr");
            const noItemsCell = document.createElement("td");
            noItemsCell.colSpan = 6; // Adjust if needed
            noItemsCell.textAlign = "center";
            noItemsCell.textContent = "No items in cart";
            noItemsRow.appendChild(noItemsCell);
            tableBody.appendChild(noItemsRow);
        }
    }

    // Initial update for all rows
    document.querySelectorAll("table tbody tr").forEach((row) => {
        updateRowTotal(row); // Initialize row totals
    });
    recalculateCartTotal(); // Recalculate the cart total
    checkCartStatus(); // Check initial cart status
});
