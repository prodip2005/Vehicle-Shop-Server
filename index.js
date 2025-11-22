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
  res.send('Server is running')
})

async function run() {
  try {
    await client.connect();
    const db = client.db('vehicle_shop');
    const productCollection = db.collection('all_vehicles');
    const BookVehicles = db.collection('book_vehicle');

    // POST new vehicle
    app.post('/allVehicles', async (req, res) => {
      const newVehicle = req.body;
      const result = await productCollection.insertOne(newVehicle);
      res.send(result);
    });

    // POST new booking
    app.post('/bookVehicles', async (req, res) => {
      const bookVehiclesData = req.body;
      
      // এখানে _id চেক না করে, গাড়ির আইডি এবং ইউজার ইমেইল দিয়ে চেক করা উচিত যদি আপনি ডুপ্লিকেট বুকিং আটকাতে চান।
      // ফরমেটে MongoDB নিজে _id দেবে, তাই সরাসরি ইনসার্ট করছি।
      const result = await BookVehicles.insertOne(bookVehiclesData);
      res.send({ message: 'Vehicle booked successfully', result });
    });

    // GET all vehicles or filter by userEmail
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

    // GET single vehicle by ID
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

    // GET all booked vehicles
    app.get('/bookVehicles', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      
      const result = await BookVehicles.find(query).toArray();
      res.send(result)
    })

    // DELETE endpoint
    app.delete('/bookVehicles/:id', async (req, res) => {
      const id = req.params.id;
      
      try {
        // MongoDB ObjectId ব্যবহার করে ডিলিট
        const result = await BookVehicles.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
          res.json({ message: 'Vehicle removed successfully' });
        } else {
          res.status(404).json({ message: 'Vehicle not found' })
        }
      } catch (error) {
        console.error("Delete Error:", error);
        res.status(400).json({ message: 'Invalid ID format or deletion error' });
      }
    });

    console.log("MongoDB connected successfully!");
  } finally {
    // Do not close client
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Server running on port ${port}`));