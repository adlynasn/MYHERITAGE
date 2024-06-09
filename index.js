const express = require("express");
const dbConnect = require("./config/dbConnect");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cartRoute");
const categoryRouter = require("./routes/categories");
const session = require("express-session"); // Import express-session
const MongoDBStore = require("connect-mongodb-session")(session); // Import connect-mongodb-session
const { Product } = require("./models/productModel");
const { Cart } = require("./models/cartModel"); // Import the Cart model
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const multer = require("multer");

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
  collection: "sessions",
});

// Catch errors
store.on("error", function (error) {
  console.error("Session store error:", error);
});

// MongoDB connection URI
const uri =
  "mongodb+srv://mirza:UZtBgNjeBJaFjsbc@myheritagedb.oagnchb.mongodb.net/myheritageDB?tls=true";

// Create a MongoClient instance
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to MongoDB
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Session middleware setup
app.use(
  session({
    secret: process.env.JWT_SECRET, // Use an environment variable for the secret
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("tiny"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use the routers for specified paths
app.use(`${api}/user`, usersRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoryRouter);

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

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richdescription: req.body.richdescription,
        price: req.body.price,
        isFeatured: req.body.isFeatured,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        category: req.body.category,
        image: {
          data: req.file.filename,
          contentType: "image/jpg",
        },
      });
      newProduct
        .save()
        .then(() => res.send("successfully uploaded"))
        .catch((err) => console.log(err));
    }
  });
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

app.get("/api/products", async (req, res) => {
  await dbConnect();

  try {
    let filter = {};
    if (req.query.categories) {
      filter.category = { $in: req.query.categories.split(",") };
    }
    if (req.query.maxPrice) {
      filter.price = { $lte: parseFloat(req.query.maxPrice) }; // Filter by maximum price
    }

    const products = await Product.find(filter).populate("category");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send(error);
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/api/featured-products", async (req, res) => {
  try {
    // Assuming you have a Product model and 'isFeatured' is a boolean attribute
    const featuredProducts = await Product.find({ isFeatured: true }).limit(3);
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/api/featured-products", async (req, res) => {
  try {
    // Assuming you have a Product model and 'isFeatured' is a boolean attribute
    const featuredProducts = await Product.find({ isFeatured: true }).limit(3);
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/cart", async (req, res) => {
  const uri =
    "mongodb+srv://mirza:UZtBgNjeBJaFjsbc@myheritagedb.oagnchb.mongodb.net/myheritageDB?tls=true";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");

    const collection = database.collection("carts");

    // Assuming you have only one cart data stored in the collection
    const cart = await collection.findOne();

    if (cart) {
      res.json({ success: true, cart });
    } else {
      res.json({ success: false, message: "Cart not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching cart");
  } finally {
    await client.close();
  }
});

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

app.post("/cart/add", async (req, res) => {
  try {
    // Extract userId and productId from the request body
    const { userId, productId } = req.body;

    // Perform any necessary validation, such as checking if userId and productId are provided
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, error: "User ID and product ID are required" });
    }

    // Fetch the product details from the database using the productId
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    // Construct the cart object including product details
    const cartItem = {
      productId: productId,
      productName: product.name,
      quantity: 1, // Quantity can be adjusted as needed
      price: product.price,
      imagePath: product.imagePath, // Assuming imagePath is a field in your Product model
      total: product.price, // Initial total is price * quantity (1)
    };

    // Find the user's cart or create a new one if it doesn't exist
    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = new Cart({ userId, items: [cartItem] });
    } else {
      // If the user's cart already exists, check if the product is already in the cart
      const existingItemIndex = userCart.items.findIndex(
        (item) => item.productId === productId
      );
      if (existingItemIndex !== -1) {
        // If the product already exists in the cart, increase the quantity
        userCart.items[existingItemIndex].quantity++;
      } else {
        // If the product is not in the cart, add it as a new item
        userCart.items.push(cartItem);
      }
    }

    // Save the updated user's cart to the database
    await userCart.save();

    // Return a success message or any relevant data
    res.json({
      success: true,
      message: "Product added to cart successfully",
      userCart,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ success: false, error: "Error adding item to cart" });
  }
});

// POST route to handle updating cart quantities
app.post("/cart/update", async (req, res) => {
  try {
    const { userId, quantities } = req.body;

    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    quantities.forEach((q) => {
      const itemIndex = userCart.items.findIndex((item) =>
        item.productId.equals(q.productId)
      );
      if (itemIndex !== -1) {
        userCart.items[itemIndex].quantity = q.quantity;
        userCart.items[itemIndex].total =
          q.quantity * userCart.items[itemIndex].price;
      }
    });

    await userCart.save();
    res.json({ success: true, message: "Cart updated successfully", userCart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, error: "Error updating cart" });
  }
});

// ADMIN FUNCTION

app.post("/loginAdmin", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("admin");

    const admin = await collection.findOne({ email: req.body.email });

    if (admin && (await bcrypt.compare(req.body.password, admin.password))) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error logging in admin" });
  } finally {
    await client.close();
  }
});

app.post("/addProduct", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("products");

    const product = {
      name: req.body.name,
      description: req.body.description,
      artisanName: req.body.artisanName,
      image: req.body.image || [], // Assuming you're passing an array of image URLs
      price: parseFloat(req.body.price), // Assuming price is a number
      category: req.body.category, // Assuming you have a category field
      countInStock: parseInt(req.body.countInStock), // Assuming countInStock is a number
      rating: parseInt(req.body.rating), // Assuming rating is a number
      numReviews: parseInt(req.body.numReviews), // Assuming numReviews is a number
      isFeatured: req.body.isFeatured === "true" || false, // Assuming isFeatured is a boolean
      dateCreated: new Date(), // Assuming you want to store the creation date
    };

    const result = await collection.insertOne(product);
    res.status(201).send(`Product added with ID: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding product");
  } finally {
    await client.close();
  }
});

app.get("/getProducts", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("products");

    const products = await collection.find({}).toArray();

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving products");
  } finally {
    await client.close();
  }
});

app.delete("/deleteProduct/:id", async (req, res) => {
  const client = new MongoClient(uri);
  const productId = req.params.id;

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("products");

    const result = await collection.deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 1) {
      res.status(200).send("Product deleted successfully");
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product");
  } finally {
    await client.close();
  }
});


// Corrected /change-password Route with Predefined ID
app.post('/change-password', async (req, res) => {
  const client = new MongoClient(uri);
  const predefinedUserId = '665de9438d48ef4b168eee50'; // predefined user ID
  const { currentPassword, newPassword } = req.body;

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const usersCollection = database.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(predefinedUserId) });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.password !== currentPassword) {
      return res.status(400).send('Current password is incorrect');
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(predefinedUserId) },
      { $set: { password: newPassword } }
    );

    res.send('Password has been successfully changed');
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send('Server error');
  }});


// PUT route to update a product
app.put("/updateProduct/:id", async (req, res) => {
  const client = new MongoClient(uri);
  const productId = req.params.id;
  const updatedProduct = req.body;

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("products");

    const result = await collection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updatedProduct }
    );

    if (result.matchedCount === 1) {
      res.status(200).send("Product updated successfully");
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product");
  } finally {
    await client.close();
  }
});

// Example of the existing GET route
app.get("/getProducts", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("products");

    const products = await collection.find({}).toArray();

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving products");
  } finally {
    await client.close();
  }
});

//artisan management

app.post("/addArtisan", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("artisans");

    const product = {
      artisanName: req.body.artisanName,
      email: req.body.email,
      contact: req.body.contact,
      category: req.body.category, // Assuming you have a category field
      image: req.body.image || [], // Assuming you're passing an array of image URLs
      dateCreated: new Date(), // Assuming you want to store the creation date
    };

    const result = await collection.insertOne(product);
    res.status(201).send(`Artisan added with ID: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding artisan");
  } finally {
    await client.close();
  }
});

app.get("/getArtisans", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("artisans");

    const products = await collection.find({}).toArray();

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving artisans");
  } finally {
    await client.close();
  }
});

app.delete("/deleteArtisan/:id", async (req, res) => {
  const client = new MongoClient(uri);
  const artisanId = req.params.id;

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("artisans");

    const result = await collection.deleteOne({ _id: new ObjectId(artisanId) });

    if (result.deletedCount === 1) {
      res.status(200).send("Artisan deleted successfully");
    } else {
      res.status(404).send("Artisan not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting artisan");
  } finally {
    await client.close();
  }
});

//categories
app.get("/getCategories", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("categories");

    const categories = await collection.find({}).toArray();

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving categories");
  } finally {
    await client.close();
  }
});

//get artisan Id
app.get("/getArtisansList", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("artisans");

    const artisans = await collection.find({}).toArray();

    res.json(artisans);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving artisans");
  } finally {
    await client.close();
  }
});

//inquiries
app.get("/getInquiries", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("inquiries");

    const products = await collection.find({}).toArray();

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving inquiries");

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
