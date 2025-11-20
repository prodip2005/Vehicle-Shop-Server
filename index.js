const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://vehicle-shop:hFLeDnTGIn0QnJO8@cluster0.d5x0yu5.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } });

app.get('/', (req, res) => {
  res.send('Hello')
})

async function run() {
  try {
    await client.connect();
    const db = client.db('vehicle_shop');
    const productCollection = db.collection('all_vehicles');

    // POST new vehicle
    app.post('/allVehicles', async (req, res) => {
      const newVehicle = req.body;
      const result = await productCollection.insertOne(newVehicle);
      res.send(result);
    });

    // GET all vehicles
    app.get('/allVehicles', async (req, res) => {
      const vehicles = await productCollection.find().toArray();
      res.send(vehicles);
    });

    // GET single vehicle by ID
    app.get('/allVehicles/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const vehicle = await productCollection.findOne({ _id: new ObjectId(id) });
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.json(vehicle);
      } catch (err) {
        res.status(500).json({ message: "Invalid ID" });
      }
    });

    console.log("MongoDB connected successfully!");
  } finally {
    // Do not close client, server keeps running
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Server running on port ${port}`));
