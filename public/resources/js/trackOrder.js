function populateOrderTable() {
    const orderTableBody = document.getElementById('orderTableBody');

    // Clear existing rows
    orderTableBody.innerHTML = '';

    // Fetch orders from the backend
    fetch('/api/order/all') // Update the endpoint URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            return response.json();
        })
        .then(orders => {
            // Iterate over the orders and populate the table
            orders.forEach(order => {
                const row = document.createElement('tr');
                let itemsString = '';
                order.items.forEach(item => {
                    itemsString += `${item.productName}, `;
                });
                itemsString = itemsString.slice(0, -2); // Remove the last comma and space
                const orderIdString = order._id ? order._id['$oid'] : 'N/A';
                const createdDate = order.createdDate ? order.createdDate['$date'] : 'N/A';
                const formattedDate = createdDate ? createdDate.substring(0, 10) : 'N/A'; // Extract first 10 characters
                row.innerHTML = `
                    <td>001</td>
                    <td>${itemsString}</td>
                    <td>${order.status}</td>
                    <td>2024-06-10</td>
                    <!-- Add more columns as needed -->
                `;
                orderTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            // Optionally display an error message to the user
        });
}

// Call the function to populate the table
populateOrderTable();
