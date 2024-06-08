const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true },

  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    },

    quantity: { 
      type: Number, 
      default: 1 
    },
    
    price: { 
      type: Number, 
      required: true 
    },
  }],

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  updatedAt: { 
    type: Date, 
    default: Date.now 
  },

  status: { 
    type: String, 
    default: 'active' 
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Cart };
