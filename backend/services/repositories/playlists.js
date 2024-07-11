"use strict";
import dataAccess from '../dataAccess.js';
import trackRepository from './tracks.js';
import mongodb from 'mongodb';

/**
 *
 Gets a playlist from the db
 * @param {string} id of the playlist
 * @param {string} user that is requesting the playlist* @param id
 * @returns {Promise<{error: string, statusCode: number}|{public}|*>} error if the user is not the owner of the playlist and the playlist is private
 */
async function getPlaylist(id, user) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').findOne({_id: new mongodb.ObjectId(id)});
    });
    if (res == null) {
        return {error: "Playlist non trovata", statusCode: 404};
    }
    let isPublic = false;
    if (typeof res?.public == "boolean") {
        isPublic = res?.public;
    } else {
        isPublic = res?.public === "true";
    }
    if (!isPublic && res?.user !== user) {
        return {error: "Non puoi visualizzare questa playlist", statusCode: 403};
    }
    return res;
}


/**
 * Gets all public playlists from the db
 */
async function getAllPublicPlaylists() {
    let res = [];
    await dataAccess.executeQuery(async (db) => {
        let cursor = await db.collection('Playlists').find({public: true});
        for await (const doc of cursor) {
            res.push(doc);
        }
    });
    return res;
}

/**
 * Edits a playlist
 @param {string} id
 @param {string} user
 @param {string} name
 @param {boolean} isPublic
 @param {string[]} tracks
 @param {string[]} tags
 @param {string} description
 @returns {Promise<{error: string, statusCode: number}|*>} error if the user is not the owner of the playlist
 */
async function editPlaylist(id, user, name, isPublic, tracks, tags, description) {
    let res;
    let playlist = await getPlaylist(id, user);
    if (playlist?.user !== user) {
        return {error: "Non puoi modificare questa playlist", statusCode: 403};
    }
    let dataToChange = {}
    if (name !== null) {
        dataToChange.name = name;
    }
    if (isPublic !== null) {
        dataToChange.public = isPublic;
    }
    if (tracks !== null) {
        dataToChange.tracks = tracks;
    }
    if (tags !== null) {
        dataToChange.tags = tags;
    }
    if (description !== null) {
        dataToChange.description = description;
    }
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').updateOne({_id: new mongodb.ObjectId(id)}, {
            $set: dataToChange
        });
    });
    return res;
}

/**
 * Adds a track to a playlist. Does nothing if the track is already in the playlist
 * @param userId the user making the request
 * @param playlistId of the playlist to add the track to
 * @param trackId of the track to add
 * @returns {Promise<{error: string, statusCode: number}|*>}
 */
async function addTrackToPlaylist(userId, playlistId, trackId) {
    let playlist = await getPlaylist(playlistId, userId);
    let newTracks = playlist.tracks;
    let foundTrack = false;
    for (let track of newTracks) {
        if (track.id === trackId) {
            foundTrack = true;
            break;
        }
    }
    let trackInfo = await trackRepository.getTrack(trackId);
    if (!foundTrack && trackInfo.error === undefined) {
        newTracks.push({id: trackId, name: trackInfo.name});
    }
    return await editPlaylist(playlistId, userId, playlist.name, playlist.public, newTracks, playlist.tags, playlist.description);
}

/**
 * Removed a track from a playlist. Does nothing if the track is not in the playlist
 * @param userId the user making the request
 * @param playlistId of the playlist to remove the track from
 * @param trackId of the track to remove
 * @returns {Promise<{error: string, statusCode: number}|*>}
 */
async function removeTrackFromPlaylist(userId, playlistId, trackId) {
    let res;
    let playlist = await getPlaylist(playlistId, userId);
    let newTracks = playlist.tracks;
    newTracks = newTracks.filter((item) => item.id !== trackId)
    return await editPlaylist(playlistId, userId, playlist.name, playlist.public, newTracks, playlist.tags, playlist.description);
}

/**
 * Creates a playlist
 @param {string} userId
 @param {string} name
 @param {boolean} isPublic
 @param {string[]} tracks
 @param {string[]} tags
 @param {string} description
 * @param thumbnail
 */
async function createPlaylist(userId, name, isPublic, tracks, tags, description, thumbnail) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').insertOne({
            user: userId,
            name: name,
            public: isPublic,
            tracks: tracks,
            tags: tags,
            description: description,
            thumbnail: thumbnail
        });
    });
    return res;
}

/**
 *
 * @param {string} id
 * @param {string} user
 * @returns {Promise<*>}
 * @returns {Promise<*|{error: string, statusCode: number}>} error if the user is not the owner of the playlist
 */
async function deletePlaylist(id, user) {
    let res;
    let playlist = await getPlaylist(id, user);
    if (playlist?.user !== user) {
        return {error: "Non puoi cancellare questa playlist", statusCode: 403};
    }
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').deleteOne({_id: new mongodb.ObjectId(id)});
    });
    return res;
}


/**
 * Searches in all public playlists
 * @param {string} name
 */
async function searchPublicPlaylists(name) {
    let res = [];
    if (name.length === 0) {
        return res;
    }
    await dataAccess.executeQuery(async (db) => {
        let searchRegex = new RegExp(".*" + name + ".*", "i");
        let cursor = await db.collection('Playlists').find({
            $or: [{
                public: true,
                name: {$regex: searchRegex}
            }, {
                public: true,
                tags: {$regex: searchRegex}
            }, {
                public: true,
                "tracks.name": {$regex: searchRegex}
            }]
        });
        for await (const doc of cursor) {
            res.push(doc);
        }
    });
    return res;
}

/**
 * Returns all playlists of a user
 * @param userId
 * @returns {Promise<*[]>}
 */
async function getAllUserPlaylists(userId) {
    let res = [];
    await dataAccess.executeQuery(async (db) => {
        let cursor = await db.collection('Playlists').find({
            user: userId
        });
        for await (const doc of cursor) {
            res.push(doc);
        }
    });
    return res;
}

/**
 *
 * @param userId
 * @returns {Promise<*>}
 */
async function getSavedPlaylists(userId) {
    let user;
    await dataAccess.executeQuery(async (db) => {
        user = await db.collection('Users').findOne({
            _id: new mongodb.ObjectId(userId)
        });
    });

    let res = [];
    for (let playlist of user.savedPlaylists) {
        try {
            let playlistData = await getPlaylist(playlist, userId)
            if (playlistData.error === undefined) {
                res.push(playlistData);
            }
        } catch (e) {
            console.log("found invalid playlist in getSavedPlaylists", e);
        }
    }
    return res;
}

/**
 *
 * @param userId
 * @param playlistId
 * @returns {Promise<*>}
 */
async function savePlaylist(userId, playlistId) {
    let res;
    let playlistIds = [];
    await dataAccess.executeQuery(async (db) => {
        playlistIds = (await db.collection('Users').findOne({
            _id: new mongodb.ObjectId(userId)
        })).savedPlaylists;
    });

    if (!playlistIds.includes(playlistId)) {
        playlistIds.push(playlistId);
    }
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Users').updateOne({_id: new mongodb.ObjectId(userId)}, {
            $set: {
                "savedPlaylists": playlistIds
            }
        });
    });
    return res;
}

/**
 *
 * @param userId
 * @param playlistId
 * @returns {Promise<*>}
 */
async function removeSavedPlaylist(userId, playlistId) {
    let res;
    let playlistIds = [];
    await dataAccess.executeQuery(async (db) => {
        playlistIds = (await db.collection('Users').findOne({
            _id: new mongodb.ObjectId(userId)
        })).savedPlaylists;
    });

    playlistIds = playlistIds.filter((item) => item !== playlistId)
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Users').updateOne({_id: new mongodb.ObjectId(userId)}, {
            $set: {
                "savedPlaylists": playlistIds
            }
        });
    });
    return res;
}

/**
 *
 * @param userId
 * @returns {Promise<{error: string, statusCode: number}|*>}
 */
async function getUserPublicPlaylists(userId) {
    let playlists = [];
    await dataAccess.executeQuery(async (db) => {
        const cursor = await db.collection('Playlists').find({user: userId, isPublic: true});
        for await (const doc of cursor) {
            playlists.push(doc);
        }
    });
    return playlists;
}

export default {
    getPlaylist,
    getAllPublicPlaylists,
    editPlaylist,
    createPlaylist,
    deletePlaylist,
    searchPublicPlaylists,
    getAllUserPlaylists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    getSavedPlaylists,
    savePlaylist,
    removeSavedPlaylist,
    getUserPublicPlaylists
};
