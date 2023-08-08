const auth = require('./authentication')
const express = require('express')
const cors = require('cors');
const config = require('config');
const app = express();
const port = config.get('server.port');
const host = config.get('server.host');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { generateSecret } = require('./authentication');
const uri = "mongodb+srv://" + config.get('db.user') + ":" + config.get('db.pass') + "@" + config.get('db.cluster') + "/?retryWrites=true&w=majority";
const authSecret = config.get('auth.secret');
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    await listDatabases(client);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

app.use(cors());

app.get('/', (req, res) => {
  res.send({ text: "Hello World" });
});


app.get('/getToken', (req, res) => {
  res.status(200).send({ token: auth.generateAccessToken("testName", authSecret) });
});


app.get('/authToken', (req, res) => {
  auth.authenticateToken(req, res, authSecret);
});

app.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}`);
});


