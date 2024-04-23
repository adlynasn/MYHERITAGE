document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.querySelector("table tbody");
    const cartTotalElement = document.getElementById("cart-total");

    // Function to update total price in a specific row
    function updateRowTotal(row) {
        const priceCell = row.querySelector("td:nth-child(3)"); // Price cell
        const quantityInput = row.querySelector("input#product-quantity"); // Input field for quantity
        const totalCell = row.querySelector("td:nth-child(5)"); // Total cell
        
        const price = parseFloat(priceCell.textContent.replace("RM", "").trim());
        const quantity = parseInt(quantityInput.value, 10); // Get the current quantity

        const total = price * quantity;
        totalCell.textContent = "RM" + total.toFixed(2); // Update the row total
    }

    // Function to recalculate the total for the whole cart
    function recalculateCartTotal() {
        let cartTotal = 0;

        // Add up the totals from each row
        tableBody.querySelectorAll("tr").forEach(row => {
            const totalCell = row.querySelector("td:nth-child(5)"); // Total cell in each row
            const rowTotal = parseFloat(totalCell.textContent.replace("RM", "").trim());
            cartTotal += rowTotal;
        });

        // Update the total cart value in the HTML
        cartTotalElement.textContent = `Total: RM${cartTotal.toFixed(2)}`;
    }

    // Event listener for increase and decrease buttons
    document.querySelectorAll(".input-group .btn").forEach(function(button) {
        button.addEventListener("click", function() {
            const row = button.closest("tr");
            const quantityInput = row.querySelector("input#product-quantity");

            let quantity = parseInt(quantityInput.value, 10); // Get the current quantity

            if (button.id === "increase-btn") {
                quantity++; // Increment
            } else if (button.id === "decrease-btn" && quantity > 1) {
                quantity--; // Decrement if greater than 1
            }

            // Update the quantity and total
            quantityInput.value = quantity; // Set the new quantity
            updateRowTotal(row); // Update the row total
            recalculateCartTotal(); // Recalculate the cart total
        });
    });

    // Event listener for manual quantity input
    document.querySelectorAll("input#product-quantity").forEach(function(input) {
        input.addEventListener("change", function() {
            const row = input.closest("tr");
            updateRowTotal(row); // Update the row total
            recalculateCartTotal(); // Recalculate the cart total
        });
    });

    // Attach click event to each remove button
    document.querySelectorAll("#remove-btn").forEach(function (button) {
        console.log("Adding event listener to:", button); // Debug log
        button.addEventListener("click", function () {
            console.log("Remove button clicked"); // Debug log
            const row = button.closest("tr"); // Find the parent row
            tableBody.removeChild(row); // Remove the row from the table
            
            checkCartStatus();

            // Update the quantity and total
            updateRowTotal();
            recalculateCartTotal(); // Recalculate total cart value
        });
    });


    // Initial update for all rows
    document.querySelectorAll("table tbody tr").forEach(function(row) {
        updateRowTotal(row); // Initialize row totals
    });
    recalculateCartTotal(); // Initialize cart total

    // Check initial cart status to display a message if empty
    function checkCartStatus() {
        if (tableBody.children.length === 0) {
            const noItemsRow = document.createElement("tr");
            const noItemsCell = document.createElement("td");
            noItemsCell.colSpan = 6; // Adjust if necessary
            noItemsCell.textContent = "No items in cart";
            noItemsCell.style.textAlign = "center";
            noItemsRow.appendChild(noItemsCell);
            tableBody.appendChild(noItemsRow);
        }
    }

    // Run the initial cart status check
    checkCartStatus();
});
