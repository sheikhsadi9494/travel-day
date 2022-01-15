const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PSS}@cluster0.4wgcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("travelDay");
        const servicesCollaction  = database.collection("services")
        const bookingsCollaction = database.collection("bookings")

        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollaction.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // ORDERS POST API
        app.post('/bookings', async (req, res) => {
            const order = req.body;
            const result = await bookingsCollaction.insertOne(order);
            console.log(result);
            res.json(result)
        });
        //GET ORDERS API
        app.get('/bookings', async (req, res) => {
            const query = bookingsCollaction.find({});
            const orders = await query.toArray();
            res.send(orders);
        });

        //GET SINGLE ORDER API
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const order = await bookingsCollaction.findOne(query);
            res.send(order);
        });

        //GET API
        app.get('/services', async (req, res) => {
            const query = servicesCollaction.find({});
            const services = await query.toArray();
            console.log(services);
            res.send(services);
        });

        //GET A SINGLE API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollaction.findOne(query);
            res.send(service);
        });

        // DELETE API
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingsCollaction.deleteOne(query);
            console.log('deleting order', result);
            res.json(result);
        })
        
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running travel day server');
})

app.listen(port, () => {
    console.log('travel day server running on', port);
})