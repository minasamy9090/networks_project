const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const url = "mongodb+srv://venom:venom@cluster0.lyvpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(url);
const dbName = "test";
async function run() {
  try {
    await client.connect();
    const database = client.db(dbName);
    const people = database.collection("people");
    // Estimate the total number of documents in the collection
    // and print out the count.
    const estimate = await people.estimatedDocumentCount();
    console.log(`Estimated number of documents in the movies collection: ${estimate}`);
    // Query for movies from Canada.
    const query = { username: "x" };
    const count = await people.countDocuments(query);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);