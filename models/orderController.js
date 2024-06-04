// orderController.js

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

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

module.exports = { updateOrderStatus };

