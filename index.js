const express = require("express");
const dbConnect = require("./config/dbConnect");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const session = require("express-session"); // Import express-session
const MongoDBStore = require("connect-mongodb-session")(session); // Import connect-mongodb-session

const app = express();
const api = process.env.API_URL;
const PORT = process.env.PORT || 3002;

dbConnect();

// Define isAuthenticated middleware function
function isAuthenticated(req, res, next) {
  // Check if user is authenticated (for example, check if userID is stored in session)
  if (req.session.userID) {
    // If authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // If not authenticated, redirect the user to the login page or send an error response
    res.redirect("/login"); // Assuming there's a login route where users can authenticate
  }
}

// Session store configuration
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL, // Use your MongoDB URI
  collection: 'sessions'
});

// Catch errors
store.on('error', function(error) {
  console.error('Session store error:', error);
});

// MongoDB connection URI
const uri =
  "mongodb+srv://mirza:UZtBgNjeBJaFjsbc@myheritagedb.oagnchb.mongodb.net/myheritageDB?tls=true";

// Create a MongoClient instance
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect().then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

// Session middleware setup
app.use(session({
  secret: process.env.JWT_SECRET, // Use an environment variable for the secret
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));


// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("tiny"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Use the routers for specified paths
app.use(`${api}/user`, usersRouter);
app.use(`${api}/products`, productsRouter);

// MongoDB Operations
app.post("/addUser", async (req, res) => {
  // MongoDB connection URI
  const uri =
    "mongodb+srv://mirza:UZtBgNjeBJaFjsbc@myheritagedb.oagnchb.mongodb.net/myheritageDB?tls=true";

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("users");

    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      address: req.body.address,
      role: "user", // Automatically set role to 'user'
    };

    const result = await collection.insertOne(user);
    res.status(201).send(`User added with ID: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user");
  } finally {
    await client.close();
  }
});

app.post("/loginUser", async (req, res) => {
  // MongoDB connection URI
  const uri =
    "mongodb+srv://mirza:UZtBgNjeBJaFjsbc@myheritagedb.oagnchb.mongodb.net/myheritageDB?tls=true";

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("users");

    const user = await collection.findOne({ email: req.body.email });

    if (user && user.password === req.body.password) {
      // Remember to hash passwords
      req.session.userID = user._id; // Save userId in session
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error logging in user" });
  } finally {
    await client.close();
  }
});

app.post("/submitInquiry", async (req, res) => {
  // MongoDB connection URI
  const uri =
    "mongodb+srv://mirza:UZtBgNjeBJaFjsbc@myheritagedb.oagnchb.mongodb.net/myheritageDB?tls=true";

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("inquiries");

    const inquiry = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    };

    const result = await collection.insertOne(inquiry);
    res.status(201).send(`Inquiry added with ID: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding inquiry");
  } finally {
    await client.close();
  }
});

app.post("/submitArtisanReview", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("artisanReview");

    const review = {
      orderId: req.body.orderId,
      review: req.body.review,
      rating: req.body.rating,
    };

    const result = await collection.insertOne(review);
    res.status(201).send(`Review submitted successfully`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting review");
  } finally {
    await client.close();
  }
});

app.post("/submitProductReview", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("productReview");

    const review = {
      orderId: req.body.orderId,
      review: req.body.review,
      rating: req.body.rating,
    };

    const result = await collection.insertOne(review);
    res.status(201).send(`Review submitted successfully`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting review");
  } finally {
    await client.close();
  }
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
