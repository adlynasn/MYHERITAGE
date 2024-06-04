const { MongoClient } = require("mongodb");

// Your actual MongoDB connection string
const uri =
  "mongodb://adlina:adlina1234@ac-bazf3qy-shard-00-00.oagnchb.mongodb.net:27017,ac-bazf3qy-shard-00-01.oagnchb.mongodb.net:27017,ac-bazf3qy-shard-00-02.oagnchb.mongodb.net:27017/?replicaSet=atlas-jfx2hw-shard-0&ssl=true&authSource=admin";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
