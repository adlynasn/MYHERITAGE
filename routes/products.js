const express = require("express");
const { Category } = require('../models/category');
const router = express.Router();
const { Product } = require('../models/productModel');
const mongoose = require('mongoose');

// Get list of products with name and image only
router.get('/', async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    const productList = await Product.find(filter).select('name image category').populate('category');
    if (!productList) {
        res.status(500).json({ success: false });
    }
    res.send(productList);
});

// Get single product
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
        res.status(500).json({ success: false });
    }
    res.send(product);
});

// Create a product
router.post('/', async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    let product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
        description: req.body.description,
        richdescription: req.body.richdescription,
        images: req.body.images,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
    });

    try {
        product = await product.save();

        if (!product) {
            return res.status(404).send('The product cannot be created');
        }
        res.send(product);
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product ID');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
        description: req.body.description,
        richdescription: req.body.richdescription,
        images: req.body.images,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
    }, { new: true });

    if (!product) {
        return res.status(404).send('The product cannot be updated');
    } else {
        res.send(product);
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'Product is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'Product is not found' });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });
    });
});

// Get product count
router.get('/get/count', async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        res.send({ productCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get featured product
router.get('/get/featured/:count', async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const productFeatured = await Product.find({ isFeatured: true }).limit(+count);
        res.send({ productFeatured });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;
