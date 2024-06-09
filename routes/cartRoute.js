const express = require('express');
const { getCart, handleAddToCart, handleRemoveFromCart } = require('../controller/cartController'); 
const router = express.Router();

// Route for getting cart
router.get('/:userId', getCart);

// Route for adding to cart
router.post('/addToCart', handleAddToCart);

// Route for removing from cart
router.delete('/remove/:productId/:userId', handleRemoveFromCart);

module.exports = router;
