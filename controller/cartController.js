const { ObjectId } = require('mongodb');
const Cart = require('../models/cartModel');

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
