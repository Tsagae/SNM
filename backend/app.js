import auth from './services/authentication.js';
import validation from './services/validation.js';
import dataAccess from './services/dataAccess.js';
import express from 'express';
import cors from 'cors';
import config from 'config';

import {createRequire} from "module";

const require = createRequire(import.meta.url);

//Swagger
import bodyParser from 'body-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerAutogen from 'swagger-autogen';

// Repositories
import albums from './services/repositories/albums.js';
import artists from './services/repositories/artists.js';
import generic from './services/repositories/generic.js';
import playlists from './services/repositories/playlists.js';
import tracks from './services/repositories/tracks.js';
import users from './services/repositories/users.js';
import genres from './services/repositories/genres.js';
import spotify from "./services/spotify.js";
import {body, validationResult} from "express-validator";
import authentication from "./services/authentication.js";
import communities from "./services/repositories/communities.js";

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

const swaggerFile = require('./swagger-output.json');


app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile, {explorer: true}));

// Registration
app.post('/register', validation.registerValidate, auth.registerUser);

// Authentication
app.post('/login', validation.loginValidate, auth.login);


app.post('/authToken', (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Validates the token of the user making the request"
     */
    if (!auth.authenticateRequest(req, res).authenticated) return;
    res.send({result: "valid token"});
});


// -------- Tracks --------
app.post('/getTrack', async (req, res) => {
    /*
        #swagger.tags = ["Tracks"]
        #swagger.summary = "Returns a spotify track by id"
        #swagger.parameters['id'] = {description: "ID of the track to get", type: "string"}
    */
    try {
        let results = await tracks.getTrack(req.body.id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/getTracks', async (req, res) => {
    /*
        #swagger.tags = ["Tracks"]
        #swagger.summary = "Returns a list of spotify tracks by ids"
        #swagger.parameters['ids'] = {description: "List of track ids", type: "array", items: {type: "string"}}
    */
    try {
        let results = await tracks.getTracks(req.body.ids);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/searchTracks', async (req, res) => {
    /*
        #swagger.tags = ["Tracks"]
        #swagger.summary = "Searches for tracks"
        #swagger.parameters['trackname'] = {description: "Name of the track to search for", type: "string"}
     */
    try {
        let results = await tracks.searchTracks(req.body.trackname);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});


// -------- Albums --------
app.post('/getAlbum', async (req, res) => {
    /*
        #swagger.tags = ["Albums"]
        #swagger.summary = "Returns a spotify album by id"
        #swagger.parameters['id'] = {description: "ID of the album to get", type: "string"}
     */
    try {
        let results = await albums.getAlbum(req.body.id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});


// -------- Artists --------
app.post('/getArtist', async (req, res) => {
    /*
        #swagger.tags = ["Artists"]
        #swagger.summary = "Returns a spotify artist by id"
        #swagger.parameters['id'] = {description: "ID of the artist to get", type: "string"}
     */
    try {
        let results = await artists.getArtist(req.body.id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/getArtists', async (req, res) => {
    /*
        #swagger.tags = ["Artists"]
        #swagger.summary = "Returns a list of spotify artists by ids"
        #swagger.parameters['ids'] = {description: "List of artist ids", type: "array", items: {type: "string"}}
     */
    try {
        let results = await artists.getArtists(req.body.ids);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/searchArtist', async (req, res) => {
    /*
        #swagger.tags = ["Artists"]
        #swagger.summary = "Searches for artists"
        #swagger.parameters['artistname'] = {description: "Name of the artist to search for", type: "string"}
     */
    try {
        let results = await artists.searchArtist(req.body.artistname);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

// -------- Playlists --------
app.post('/getPlaylist', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Returns a playlist by id"
        #swagger.parameters['id'] = {description: "ID of the playlist to get", type: "string"}
     */
    if (!auth.authenticateRequest(req, res).authenticated) return;
    let authReq = auth.authenticateRequest(req, res);
    try {
        let results = await playlists.getPlaylist(req.body.id, authReq.user._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/getAllPublicPlaylists', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Returns all public playlists"
     */
    try {
        let results = await playlists.getAllPublicPlaylists();
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/searchPublicPlaylists', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Searches for public playlists"
        #swagger.parameters['name'] = {description: "Name of the playlist to search for", type: "string"}
     */
    try {
        let results = await playlists.searchPublicPlaylists(req.body.name);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/editPlaylist', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Edits a playlist. If a field is null it won't be modified."
        #swagger.parameters['id'] = {description: "ID of the playlist to edit", type: "string"}
        #swagger.parameters['name'] = {description: "Name of the playlist", type: "string"}
        #swagger.parameters['isPublic'] = {description: "Boolean if the playlist is public", type: "boolean"}
        #swagger.parameters['tracks'] = {description: "List of tracks in the playlist", type: "array", items: {type: "string"}}
        #swagger.parameters['tags'] = {description: "List of tags for the playlist", type: "array", items: {type: "string"}}
        #swagger.parameters['description'] = {description: "Description of the playlist", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.editPlaylist(req.body.id, authReq.user._id, req.body.name, req.body.isPublic, req.body.tracks, req.body.tags, req.body.description);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});


app.post('/addTrackToPlaylist', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Adds a track to a playlist"
        #swagger.parameters['playlist'] = {description: "ID of the playlist to add the track to", type: "string"}
        #swagger.parameters['track'] = {description: "ID of the track to add to the playlist", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.addTrackToPlaylist(authReq.user._id, req.body.playlist, req.body.track);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/removeTrackFromPlaylist', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Removes a track from a playlist"
        #swagger.parameters['playlist'] = {description: "ID of the playlist to remove the track from", type: "string"}
        #swagger.parameters['track'] = {description: "ID of the track to remove from the playlist", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.removeTrackFromPlaylist(authReq.user._id, req.body.playlist, req.body.track);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});


app.post('/createPlaylist', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Creates a playlist"
        #swagger.parameters['name'] = {description: "Name of the playlist", type: "string"}
        #swagger.parameters['isPublic'] = {description: "Boolean if the playlist is public", type: "boolean"}
        #swagger.parameters['tracks'] = {description: "List of tracks in the playlist", type: "array", items: {type: "string"}}
        #swagger.parameters['tags'] = {description: "List of tags for the playlist", type: "array", items: {type: "string"}}
        #swagger.parameters['description'] = {description: "Description of the playlist", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.createPlaylist(authReq.user._id, req.body.name, req.body.isPublic, req.body.tracks, req.body.tags, req.body.description);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/deletePlaylist', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Deletes a playlist"
        #swagger.parameters['id'] = {description: "ID of the playlist to delete", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.deletePlaylist(req.body.id, authReq.user._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/myPlaylists', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Returns all playlists of the user"
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.getAllUserPlaylists(authReq.user._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/getMySavedPlaylists', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Returns all playlists saved by the user"
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.getSavedPlaylists(authReq.user._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/savePlaylist', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Saves a playlist for the user"
        #swagger.parameters['id'] = {description: "ID of the playlist to save", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.savePlaylist(authReq.user._id, req.body._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/removeSavedPlaylist', async (req, res) => {
    /*
        #swagger.tags = ["Playlists"]
        #swagger.summary = "Removes a saved playlist for the user"
        #swagger.parameters['id'] = {description: "ID of the playlist to remove", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await playlists.removeSavedPlaylist(authReq.user._id, req.body._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

// -------- Users --------
app.post('/getUser', async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Returns a user by id"
        #swagger.parameters['id'] = {description: "ID of the user to get", type: "string"}
     */
    try {
        let results = await users.getUser(req.body._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/editUser', async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Edits a user. If a field is null it won't be modified."
        #swagger.parameters['username'] = {description: "Username of the user", type: "string"}
        #swagger.parameters['email'] = {description: "Email of the user", type: "string"}
        #swagger.parameters['artists'] = {description: "List of artists the user likes", type: "array", items: {type: "string"}}
        #swagger.parameters['genres'] = {description: "List of genres the user likes", type: "array", items: {type: "string"}}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await users.editUser(authReq.user._id, req.body.username, req.body.email, req.body.artists, req.body.genres);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/changePassword', validation.passwordValidate, async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Changes the password of the user"
        #swagger.parameters['password'] = {description: "New password for the user", type: "string"}
     */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await authentication.changePassword(authReq.user._id, req.body.password);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/deleteUser', async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Deletes the user"
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await users.deleteUser(authReq.user._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/getMyInfo', async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Returns all information about the user"
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await users.getAllUserInfo(authReq.user._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/searchUser', async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Searches for a user by username"
        #swagger.parameters['username'] = {description: "Username of the user to search for", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await users.searchUser(req.body.username);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

// -------- Search --------
app.post('/search', async (req, res) => {
    /*
        #swagger.tags = ["Search"]
        #swagger.summary = "Searches for tracks and playlists"
        #swagger.parameters['query'] = {description: "Query to search for", type: "string"}
        #swagger.parameters['filters'] = {description: "List of filters to apply to the search", type: "array", items: {type: "string"}}
     */
    try {
        let results = await generic.search(req.body.query, req.body.filters);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/getGenres', async (req, res) => {
    /*
        #swagger.tags = ["Genres"]
        #swagger.summary = "Returns all genres from spotify"
     */
    try {
        let results = await genres.getGenres();
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

// -------- Communities --------

app.post('/createCommunity', async (req, res) => {
    /*
        #swagger.tags = ["Communities"]
        #swagger.summary = "Creates a community"
        #swagger.parameters['users'] = {description: "List of users (as ids) to add to the community", type: "array", items: {type: "string"}}
        #swagger.parameters['communityName'] = {description: "Name of the community", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await communities.createCommunity(authReq.user._id, req.body.users, req.body.communityName);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/getCommunity', async (req, res) => {
    /*
        #swagger.tags = ["Communities"]
        #swagger.summary = "Returns a community by id"
        #swagger.parameters['id'] = {description: "ID of the community to get", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await communities.getCommunity(authReq.user._id, req.body._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/sharePlaylist', async (req, res) => {
    /*
        #swagger.tags = ["Communities"]
        #swagger.summary = "Shares a playlist with a community"
        #swagger.parameters['communityId'] = {description: "ID of the community to share the playlist with", type: "string"}
        #swagger.parameters['playlistId'] = {description: "ID of the playlist to share", type: "string"}
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await communities.sharePlaylist(authReq.user._id, req.body.communityId, req.body.playlistId);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

app.post('/getMyCommunities', async (req, res) => {
    /*
        #swagger.tags = ["Communities"]
        #swagger.summary = "Returns all communities the user is in"
     */
    let authReq = auth.authenticateRequest(req, res);
    if (!authReq.authenticated) return;
    try {
        let results = await communities.getMyCommunities(authReq.user._id);
        return await handleRequest(results, res);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

// -------- Listen --------

app.listen(port, host, async () => {
    console.log(`Server is running on ${host}:${port}`);
    await dataAccess.testConnection();
    await dataAccess.connect();
    await spotify.getApiTokenFromDB();
});
