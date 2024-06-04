const express = require("express");
const router = express.Router();
const { createUser } = require("../controller/userCtrl");
const Product = require("../models/productModel");
router.post("/register", createUser);

module.exports = router;
