const express=require("express");
const router=express.Router();
const Product = require('../models/productModel');
router.get('/',async (req, res) => {
    const productList=await Product.find ();
    res.send(productList);
});
router.post('/', async (req, res) => {
    const { name, image, countInStock } = req.body;

    const product = new Product({
        name,
        image,
        countInStock
    });

    try {
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        });
    }
});
    
module.exports=router;