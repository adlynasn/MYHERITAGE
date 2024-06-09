// orderController.js
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
const Order = require('../models/orderModel');

const mongoose = require('mongoose');

// Create a new order
const createOrder = async (req, res) => {
  try {
      // Extract user ID and items from the request body
      const { userID, items } = req.body;

      // Set the status to "Pending"
      const status = 'Pending';

      // Create a new order object with the extracted data
      const newOrder = new Order({
          userID,
          items,
          status // Set the status to "Pending"
      });

      // Save the new order to the database
      const savedOrder = await newOrder.save();

      // Return the newly created order in the response
      res.status(201).json(savedOrder);
  } catch (error) {
      // Handle errors
      res.status(400).json({ message: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an order by ID
const updateOrderById = async (req, res) => {
    const { id } = req.params;
    const { orderNumber, items, status } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderNumber, items, status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an order by ID
const deleteOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function updateOrderStatus(orderId, newStatus) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("myheritageDB");
    const collection = database.collection("orderTracking");

    const result = await collection.updateOne(
      { orderId },
      { $set: { status: newStatus } }
    );

    if (result.modifiedCount === 0) {
      throw new Error("No document matched the query. Updated 0 documents.");
    }

    console.log(`Order status updated for orderId: ${orderId}`);
  } catch (err) {
    console.error(err);
    throw new Error("Error updating order status");
  } finally {
    await client.close();
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  updateOrderStatus // Add updateOrderStatus here
};

