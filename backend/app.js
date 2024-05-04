import auth from './services/authentication.js';
import validation from './services/validation.js';
import dataAccess from './services/dataAccess.js';
import express from 'express';
import cors from 'cors';
import config from 'config';

// Repositories
import albums from './services/repositories/albums.js';
import artists from './services/repositories/artists.js';
import generic from './services/repositories/generic.js';
import playlists from './services/repositories/playlists.js';
import tracks from './services/repositories/tracks.js';
import users from './services/repositories/users.js';
import spotify from "./services/spotify.js";


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

app.get('/searchTracks', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return tracks.searchTracks(req.query.trackname).then((results) => res.send(results));
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
        return res.status(403).send({error: e.message});
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

app.listen(port, host, async() => {
    console.log(`Server is running on ${host}:${port}`);
    await dataAccess.testConnection();
    await spotify.getApiTokenFromDB();
});
