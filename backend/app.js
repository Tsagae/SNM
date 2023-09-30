const auth = require('./services/authentication')
const validation = require('./services/validation')
const spotify = require('./services/spotify')
const express = require('express')
const cors = require('cors');
const config = require('config');

// Repositories
const albums = require('./services/repositories/albums');
const artists = require('./services/repositories/artists');
const generic = require('./services/repositories/generic');
const playlists = require('./services/repositories/playlists');
const tracks = require('./services/repositories/tracks');
const users = require('./services/repositories/users');

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
    if (!auth.authenticateRequest(req, res).authenticated) return;
    res.send({result: "valid token"});
});

//Spotify
app.get('/search', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return generic.search(req.query.q, req.query.filters).then((results) => res.send(results));
});


// -------- Tracks --------
app.get('/getTrack', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return tracks.getTrack(req.query.id).then((results) => res.send(results));
});

app.get('/getTracks', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return tracks.getTracks(req.query.ids).then((results) => res.send(results));
});


// -------- Albums --------
app.get('/getAlbum', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return albums.getAlbum(req.query.id).then((results) => res.send(results));
});


// -------- Artists --------
app.get('/getArtist', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return artists.getArtist(req.query.id).then((results) => res.send(results));
});

// -------- Playlists --------
app.get('/getPlaylist', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return playlists.getPlaylist(req.query.id).then((results) => res.send(results));
});

app.get('/getAllPublicPlaylists', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return playlists.getAllPublicPlaylists().then((results) => res.send(results));
});

app.get('/editPlaylist', (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    return playlists.editPlaylist(req.query.id, authReq.user.username, req.query.name, req.query.isPublic, req.query.tracks).then((results) => res.send(results)).catch((e) => {
        return res.status(400).send({error: e.message});
    });
});

app.get('/createPlaylist', (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    return playlists.createPlaylist(authReq.user.username, req.query.name, req.query.isPublic, req.query.tracks).then((results) => res.send(results));
});
// -------- Users --------
app.get('/getUser', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return users.getUser(req.query.id).then((results) => res.send(results));
});


app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`);
});


