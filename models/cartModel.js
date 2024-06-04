const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB connection URI
const uri = process.env.MONGO_URI || 'mongodb+srv://adlina:adlina1234@myheritagedb.oagnchb.mongodb.net/';

class Cart {
  constructor() {
    this.client = new MongoClient(uri);
    this.database = null;
    this.collection = null;
  }

  async connect() {
    if (!this.client.isConnected()) {
      await this.client.connect();
      this.database = this.client.db('your_database_name');
      this.collection = this.database.collection('cart');
    }
  }

  async addItem(userId, productId, quantity, price) {
    await this.connect();

    const cartItem = {
      userId: new ObjectId(userId),
      items: [{
        productId: new ObjectId(productId),
        quantity: quantity || 1,
        price: price
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    };

    const result = await this.collection.insertOne(cartItem);
    return result.insertedId;
  }

  async getCart(userId) {
    await this.connect();
    return await this.collection.findOne({ userId: new ObjectId(userId) });
  }

  async updateCart(userId, items) {
    await this.connect();
    const updatedCart = await this.collection.updateOne(
      { userId: new ObjectId(userId) },
      { $set: { items: items, updatedAt: new Date() } }
    );
    return updatedCart.modifiedCount;
  }

  async deleteCart(userId) {
    await this.connect();
    const result = await this.collection.deleteOne({ userId: new ObjectId(userId) });
    return result.deletedCount;
  }
}

module.exports = new Cart();
