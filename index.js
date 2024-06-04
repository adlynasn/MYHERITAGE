const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();
const api = process.env.API_URL || "/api/v1";
const PORT = process.env.PORT || 3002;

// Connect to the database
dbConnect();

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
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in user");
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

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
