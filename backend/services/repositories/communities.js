"use strict";

import dataAccess from "../dataAccess.js";
import mongodb from "mongodb";

async function createCommunity(ownerId, users, communityName) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Communities').insertOne({
            owner: ownerId,
            users: users,
            sharedPlaylists: [],
            communityName: communityName
        });
    });
    return res;
}

async function getCommunity(userId, communityId) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Communities').findOne({_id: new mongodb.ObjectId(communityId)});
    });
    if (res == null) {
        return {error: "Community non trovata", statusCode: 404};
    }
    if (res.owner !== userId && !res.includes(userId)) {
        return {error: "Non puoi visualizzare questa community", statusCode: 403};
    }
    return res;
}

async function sharePlaylist(userId, communityId, playlistId) {
    let res;
    let community = await getCommunity(userId, communityId);
    if (community.error !== undefined) {
        return community;
    }
    community.sharedPlaylists.push({user: userId, playlist: playlistId})
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Communities').updateOne({_id: new mongodb.ObjectId(communityId)}, {
            $set: {sharedPlaylists: community.sharedPlaylists}
        });
    });

    return res;
}


export default {createCommunity, sharePlaylist, getCommunity};
