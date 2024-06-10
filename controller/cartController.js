const Cart = require('../models/cartModel.js'); // Assuming you have a Cart model

// Function to get the cart for a user
async function getCart(req, res) {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        res.json({ success: true, cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Function to handle adding an item to the cart
async function handleAddToCart(req, res) {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.json({ success: true, cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Handle remove from cart
const handleRemoveFromCart = async (req, res) => {
  try {
      const { productId, userId } = req.params;
      const cart = await Cart.findOne({ userId });
      if (!cart) {
          return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();

      res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, handleAddToCart, handleRemoveFromCart };

