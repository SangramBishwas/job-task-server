const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json())

console.log()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3mmbmgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const mobileCollections = client.db("MobileHUB").collection("mobiles");
    // Send a ping to confirm a successful connection

    app.get('/mobiles', async (req, res) => {
      const filter = req.query;
      console.log(filter)
      const query = {
        // price: { $lt: 150, $gt: 50 }
        // db.InspirationalWomen.find({first_name: { $regex: /Harriet/i} })
        name: {$regex: filter.search, $options: 'i'},
        category: {$regex: filter.category}
      };

      const options = {
        sort: {
          price: filter.sort === 'asc' ? 1 : -1,
        },
      };
      const cursor = mobileCollections.find(query, options);
      const result = await cursor.toArray();
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('MobileHUB is running')
})

app.listen(port, () => {
  console.log(`MobileHUB is running on port ${port}`)
})