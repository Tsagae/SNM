const auth = require('./services/authentication')
const validation = require('./services/validation')
const express = require('express')
const cors = require('cors');
const config = require('config');

const app = express();
const port = config.get('server.port');
const host = config.get('server.host');
const authSecret = config.get('auth.secret');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ text: "Hello World" });
});



// Registration
app.post('/register', validation.loginValidate, auth.registerUser); // TODO change loginValidate with registerValidate



// Authentication
app.post('/login', validation.loginValidate, auth.login);


app.get('/getToken', (req, res) => {
  res.status(200).send({ token: auth.generateAccessToken({ username: "testName" }) });
});


app.get('/authToken', (req, res) => {
  auth.authenticateRequest(req, res, authSecret);
});


app.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}`);
});


