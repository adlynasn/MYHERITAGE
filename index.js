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
