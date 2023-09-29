const auth = require('./services/authentication')
const validation = require('./services/validation')
const spotify = require('./services/spotify')
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
    res.send({text: "Hello World"});
});


// Registration
app.post('/register', validation.registerValidate, auth.registerUser); // TODO change loginValidate with registerValidate


// Authentication
app.post('/login', validation.loginValidate, auth.login);


app.post('/authToken', (req, res) => {
    if (auth.authenticateRequest(req, res) != null) return;
    res.send({result: "valid token"});
});

//Spotify
app.get('/search', (req, res) => {
    if (auth.authenticateRequest(req, res) != null) return;
    return spotify.search(req.query.q, req.query.filters).then((results) => res.send(results));
});

app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`);
});


