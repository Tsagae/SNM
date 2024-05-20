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


// -------- Tracks --------
app.post('/getTrack', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return tracks.getTrack(req.body.id).then((results) => res.send(results));
});

app.post('/getTracks', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return tracks.getTracks(req.body.ids).then((results) => res.send(results));
});

app.post('/searchTracks', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return tracks.searchTracks(req.body.trackname).then((results) => res.send(results));
});


// -------- Albums --------
app.post('/getAlbum', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return albums.getAlbum(req.body.id).then((results) => res.send(results));
});


// -------- Artists --------
app.post('/getArtist', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return artists.getArtist(req.body.id).then((results) => res.send(results));
});

// -------- Playlists --------
app.post('/getPlaylist', (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    return playlists.getPlaylist(req.body.id, authReq.user.username).then((results) => res.send(results)).catch((e) => {
        return res.status(403).send({error: e.message});
    });
});

app.post('/getAllPublicPlaylists', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return playlists.getAllPublicPlaylists().then((results) => res.send(results));
});

app.post('/searchPublicPlaylists', (req, res) => {
    return playlists.searchPublicPlaylists(req.body.name).then((results) => res.send(results));
});

app.post('/editPlaylist', (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    return playlists.editPlaylist(req.body.id, authReq.user.username, req.body.name, req.body.isPublic, req.body.tracks, req.body.tags).then((results) => res.send(results)).catch((e) => {
        return res.status(403).send({error: e.message});
    });
});

app.post('/createPlaylist', (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    return playlists.createPlaylist(authReq.user.username, req.body.name, req.body.isPublic, req.body.tracks, req.body.tags).then((results) => res.send(results));
});

app.post('/deletePlaylist', (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    return playlists.deletePlaylist(req.body.id, authReq.user.username).then((results) => res.send(results)).catch((e) => {
        return res.status(403).send({error: e.message});
    });
});

// -------- Users --------
app.post('/getUser', (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    return users.getUser(req.body.id).then((results) => res.send(results));
});

// -------- Search --------
app.post('/search', (req, res) => {
    return generic.search(req.body.query, req.body.filters).then((results) => res.send(results));
});

app.listen(port, host, async () => {
    console.log(`Server is running on ${host}:${port}`);
    await dataAccess.testConnection();
    await spotify.getApiTokenFromDB();
});
