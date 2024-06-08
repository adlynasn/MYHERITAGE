const { Category } = require('../models/category')
const { Product } = require('../models/productModel')


//ADD PRODUCT


const addProduct = (req, res, next) => {
    const productData = {
        name: req.body.name,
        description: req.body.description,
        richdescription: req.body.richdescription,
        price: req.body.price,
        isFeatured: req.body.isFeatured,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        category: req.body.category
    };

    if (req.file) {
        // Store the relative path of the uploaded file
        productData.imagePath = `uploads/${req.file.filename}`;
    }

    const product = new Product(productData);
    
    product.save()
        .then(response => {
            res.json({
                message: 'Product added successfully!',
                product: response
            });
        })
        .catch(error => {
            console.error('Error adding product:', error); // Log the error message
            res.status(500).json({
                message: 'An error occurred!'
            });
        });
};

module.exports = { addProduct };

