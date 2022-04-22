const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello Mehedi!")
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require("express/lib/response");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.drus2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const servicesCollection = client.db('carServices').collection('users');

        // FIND all services (find multiple documents)
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // SET dynamic params (find one documents)
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await servicesCollection.findOne(query);
            res.send(services);
        })

        // POST (insert one documents)
        app.post('/services', async (req, res) => {
            const newUser = req.body;
            const result = await servicesCollection.insertOne(newUser);
            res.send(result);
        })

        // DELETE (delete one documents)
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.listen(port, () => {
    console.log("I am ok Boss!");
})