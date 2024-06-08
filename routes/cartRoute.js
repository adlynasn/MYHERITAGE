const express = require('express');
const { getCart, handleAddToCart } = require('../controller/cartController'); // Import both functions
const router = express.Router();

// Route for getting cart
router.get('/:userId', getCart);

// Route for adding to cart (assuming handleAddToCart is the correct function)
router.post('/addToCart', handleAddToCart); 
module.exports = router;

