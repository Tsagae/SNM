const config = require('config');
const {MongoClient, ServerApiVersion} = require('mongodb');
const uri = "mongodb+srv://" + config.get('db.user') + ":" + config.get('db.pass') + "@" + config.get('db.cluster') + "/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

exports.executeQuery = executeQuery;

/**
 * Executes a query or a series of queries. Remember to use await before every db operation inside the query function or a MongoExpiredSessionError could be thrown
 * @param {Function} query function that takes as input a database
 */
async function executeQuery(query) {
    try {
        await client.connect();
        const db = client.db('snm_db');
        await query(db);
    } finally {
        await client.close();
    }
}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        await listDatabases(client);

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function listDatabases(client) {
    let databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
