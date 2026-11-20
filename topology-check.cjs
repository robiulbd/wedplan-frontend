const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://127.0.0.1:29999/test", {
  serverSelectionTimeoutMS: 1000,
});

client
  .db()
  .collection("x")
  .findOne({})
  .catch(() => {
    const topology = client.topology;
    console.log("own props:", Object.keys(topology));
    console.log("description:", JSON.stringify(topology.description?.type));
    console.log("closed:", topology.closed);
    console.log("s state:", topology.s && Object.keys(topology.s));
  });
