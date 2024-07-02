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

async function handleRequest(results, response) {
    if (results.error !== undefined && results.statusCode !== undefined) { //TODO: should change this to check if results has this exact structure {error: string, status: number}
        return response.status(results.statusCode).send({error: results.error});
    }
    return response.send(results);
}

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
app.post('/getTrack', async (req, res) => {
    // if (!auth.authenticateRequest(req, res).authenticated) return;
    try {
        let results = await tracks.getTrack(req.body.id);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

app.post('/getTracks', async (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    try {
        let results = await tracks.getTracks(req.body.ids);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

app.post('/searchTracks', async (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    try {
        let results = await tracks.searchTracks(req.body.trackname);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});


// -------- Albums --------
app.post('/getAlbum', async (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    try {
        let results = await albums.getAlbum(req.body.id);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});


// -------- Artists --------
app.post('/getArtist', async (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    try {
        let results = await artists.getArtist(req.body.id);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

// -------- Playlists --------
app.post('/getPlaylist', async (req, res) => {
    if (!auth.authenticateRequest(req, res).authenticated) return;
    let authReq = auth.authenticateRequest(req, res);
    try {
        let results = await playlists.getPlaylist(req.body.id, authReq.user.username);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

app.post('/getAllPublicPlaylists', async (req, res) => {
    try {
        let results = await playlists.getAllPublicPlaylists();
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

app.post('/searchPublicPlaylists', async (req, res) => {
    try {
        let results = await playlists.searchPublicPlaylists(req.body.name);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

app.post('/editPlaylist', async (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.editPlaylist(req.body.id, authReq.user.username, req.body.name, req.body.isPublic, req.body.tracks, req.body.tags);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

app.post('/createPlaylist', async (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.createPlaylist(authReq.user.username, req.body.name, req.body.isPublic, req.body.tracks, req.body.tags);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

app.post('/deletePlaylist', async (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.deletePlaylist(req.body.id, authReq.user.username);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

// -------- Users --------
app.post('/getUser', async (req, res) => {
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await users.getUser(req.body.username, authReq.user.username);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

// -------- Search --------
app.post('/search', async (req, res) => {
    try {
        let results = await generic.search(req.body.query, req.body.filters);
        return await handleRequest(results, res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

app.listen(port, host, async () => {
    console.log(`Server is running on ${host}:${port}`);
    await dataAccess.testConnection();
    await spotify.getApiTokenFromDB();
});
