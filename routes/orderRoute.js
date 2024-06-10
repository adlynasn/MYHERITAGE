// orderRoute.js

const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

// Create a new order
router.post('/order/create', orderController.createOrder);

// Get all orders
router.get('/order/all', orderController.getAllOrders);

// Get an order by ID
router.get('/order/:id', orderController.getOrderById);

// Update an order by ID
router.put('/order/update/:id', orderController.updateOrderById);

// Delete an order by ID
router.delete('/order/delete/:id', orderController.deleteOrderById);

module.exports = router;
