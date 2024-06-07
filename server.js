const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection URI
const uri =
  "mongodb://adlina:adlina1234@ac-bazf3qy-shard-00-00.oagnchb.mongodb.net:27017,ac-bazf3qy-shard-00-01.oagnchb.mongodb.net:27017,ac-bazf3qy-shard-00-02.oagnchb.mongodb.net:27017/?replicaSet=atlas-jfx2hw-shard-0&ssl=true&authSource=admin";

app.post("/addUser", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
