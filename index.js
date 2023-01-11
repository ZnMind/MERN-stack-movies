const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

/* app.get('/', (req, res) => {
    res.send({ "Server Status:": "Server is running :)" })
}); */

app.options('/movies', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
});

app.get('/movies/:year?', async (req, res) => {
    const client = new MongoClient(process.env.URI);
    try {
        const key = req.query.key;
        const val = req.query.value;
        const year = req.params.year;

        const database = client.db('sample_mflix');
        const movies = database.collection('movies');

        const cursor = await movies.find({ year: parseInt(year) }).toArray();
        res.send(cursor);
    } finally {
        await client.close();
    }
})

/* app.get('/test', (req, res) => {
    const body = req.query;
    console.log(body);
    res.json(body);
}) */

const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
});

module.exports = app;