const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    countInStock: { type: Number, required: false},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;