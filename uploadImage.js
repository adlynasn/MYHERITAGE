const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// MongoDB connection URI
const uri = 'mongodb+srv://adlina:adlina1234@myheritagedb.oagnchb.mongodb.net/'; // Your MongoDB URI

// Define a schema for the image model
const imageSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    image: Buffer
});

// Create a model for the image collection
const Image = mongoose.model('Image', imageSchema);

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Read the image file
        const fs = require('fs');
        const imagePath = 'public/media/printedbatik.jpg';
        const imageName = path.basename(imagePath);
        const imageData = fs.readFileSync(imagePath);

        // Create a new image document
        const newImage = new Image({
            filename: imageName,
            contentType: 'image/jpeg',
            image: imageData
        });

        // Save the image document to MongoDB
        return newImage.save();
    })
    .then(() => {
        console.log('Image uploaded successfully');
    })
    .catch((error) => {
        console.error('Error uploading image:', error);
    });
