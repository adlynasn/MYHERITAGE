const { ObjectId } = require('mongodb');
const Cart = require('../models/cartModel');

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

    const newCartItem = new Cart({
      userId,
      items: [{
        productId,
        quantity,
        price: product.price,
        image: product.image, 
      }],
    });

    await newCartItem.save();
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
