const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send({ "Server Status:": "Server is running :)" })
});

app.get('/movies/:year?', async (req, res) => {
    const client = new MongoClient(process.env.URI);
    const year = req.params.year;

    // Vercel serverless functions timeout after 10 seconds and require a response or a 504 error occurs. 
    // If db connection goes through this timeout is cleared.
    const id = setTimeout(()  => res.json({
        message: "There was an error with the upstream service!"
    }), 9000);

    try {
        const database = client.db('sample_mflix');
        const movies = database.collection('movies');

        const cursor = await movies.find({ year: parseInt(year) }).toArray();

        clearTimeout(id);
        res.send(cursor);
    } catch(err) {
        res.status(500).json({ message: err.message });
    } finally {
        await client.close();
    }
})

const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
});

module.exports = app;