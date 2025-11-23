require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d5x0yu5.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } });

app.get('/', (req, res) => {
  res.send('Server is running')
})

async function run() {
  try {
    await client.connect();
    const db = client.db('vehicle_shop');
    const productCollection = db.collection('all_vehicles');
    const BookVehicles = db.collection('book_vehicle');

    app.post('/allVehicles', async (req, res) => {
      const newVehicle = req.body;
      const result = await productCollection.insertOne(newVehicle);
      res.send(result);
    });


    app.post('/bookVehicles', async (req, res) => {
      try {
        const bookVehiclesData = req.body;

        const { vehicleId, email } = bookVehiclesData;
        if (!vehicleId || !email) {
          return res.status(400).send({ message: 'vehicleId and email are required' });
        }

        const exists = await BookVehicles.findOne({ vehicleId: vehicleId, email: email });
        if (exists) {
          return res.status(400).send({ message: 'You already booked this vehicle.' });
        }


        const result = await BookVehicles.insertOne(bookVehiclesData);
        res.status(201).send({ message: 'Vehicle booked successfully', result });
      } catch (err) {
        console.error('Booking POST error:', err);
        res.status(500).send({ message: 'Server error while booking' });
      }
    });


    app.get('/allVehicles', async (req, res) => {
     
      const email = req.query.userEmail;
      const query = {};
      if (email) {
        query.userEmail = email;
      }
      const cursor = productCollection.find(query)
      const result = await cursor.toArray()
      res.send(result);
    });

    app.get('/allVehicles/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const vehicle = await productCollection.findOne({ _id: new ObjectId(id) });
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.json(vehicle);
      } catch (err) {
        console.error("Error fetching vehicle:", err);
        res.status(500).json({ message: "Invalid ID or server error" });
      }
    });

    app.get('/bookVehicles', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }

      const result = await BookVehicles.find(query).toArray();
      res.send(result)
    })

    app.delete('/bookVehicles/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await BookVehicles.deleteOne(query)
      res.send(result)
    });

    app.delete('/allVehicles/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result)
    })

    app.put('/allVehicles/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const updateService = {
        $set: data
      }
      const result = await productCollection.updateOne(query, updateService);
      res.send(result)

    })

    console.log("MongoDB connected successfully!");
  } finally {
    // Do not close client
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Server running on port ${port}`));