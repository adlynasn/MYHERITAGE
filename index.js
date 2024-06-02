const express = require('express');
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const api = process.env.API_URL;
const PORT = process.env.PORT || 3002;

// Connect to the database
dbConnect();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));

// Use the routers for specified paths
app.use(`${api}/user`, usersRouter);
app.use(`${api}/products`, productsRouter);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
=======
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/digitic', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define User Schema
const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create User Model
const UserModel = mongoose.model('users', UserSchema);

// Middleware to parse JSON
app.use(express.json());

// Define route to get users
app.get('/getUsers', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Define route to create a new user
app.post('/createUser', async (req, res) => {
    console.log('POST /createUser called');
    console.log('Request body:', req.body);
    try {
        const user = new UserModel(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
