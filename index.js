const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5q2fm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = "mongodb://localhost:27017/";
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("productDB").collection("products");

    // read
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // filter through email

    app.get("/myCart/:email", async (req, res) => {
      const email = { email: req.params.email };
      // console.log(email);
      const query = productCollection.find(email);
      const result = await query.toArray();
      res.send(result);
    });

    // get by id

    app.get("/singleCart/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // post
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      // console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //  update

    app.put("/updateCart/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedCart = req.body;

      const updatedDoc = {
        $set: {
          name: updatedCart.name,
          price: updatedCart.price,
          description: updatedCart.description,
        },
      };
      // console.log(id, updatedCart);
      const result = await productCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Quick buy server  Running!");
});

app.listen(port, () => {
  console.log(`Example Quick Buy server running on port ${port}`);
});
