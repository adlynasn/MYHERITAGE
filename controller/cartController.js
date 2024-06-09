const { ObjectId } = require('mongodb');
const { Cart } = require('../models/cartModel'); // Import Cart model
const { Product } = require('../models/productModel'); // Import Product model using object destructuring

exports.handleAddToCart = async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body

  const { userId, productId, quantity } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    console.log('Product:', product); // Log the product (for debugging purposes)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user already has a cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the user doesn't have a cart, create a new one
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex !== -1) {
      // If the product already exists, update its quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // If the product doesn't exist, add it to the cart
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        image: product.image
      });
    }

    // Update the cart in the database
    await cart.save();

    res.status(201).json({ message: 'Item added to cart successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.params.userId;

  try {
    const cart = await Cart.findOne({ userId: new ObjectId(userId) });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};
