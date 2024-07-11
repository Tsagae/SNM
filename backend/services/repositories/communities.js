"use strict";

import dataAccess from "../dataAccess.js";
import mongodb from "mongodb";

async function createCommunity(ownerId, users, communityName) {
    let res;
    users = users.filter((item) => item !== ownerId)
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

async function editCommunity(ownerId, communityId, communityName, users) {
    let res;
    const comm = await getCommunity(ownerId, communityId);
    if (comm.error !== undefined) {
        return comm;
    }
    if (comm.owner !== ownerId) {
        return {error: "Non sei il proprietario della community", statusCode: 403};
    }
    let dataToChange = {};
    if (users !== null) {
        users = users.filter((item) => item !== ownerId)
        dataToChange.users = users;
    }
    if (communityName !== null) {
        dataToChange.communityName = communityName;
    }
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Communities').updateOne({_id: new mongodb.ObjectId(communityId)}, {
            $set: dataToChange
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
    if (res.owner !== userId && !res.users.includes(userId)) {
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
    community.sharedPlaylists.unshift({user: userId, playlist: playlistId})
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Communities').updateOne({_id: new mongodb.ObjectId(communityId)}, {
            $set: {sharedPlaylists: community.sharedPlaylists}
        });
    });

    return res;
}

async function getMyCommunities(userId) {
    let communities = [];
    await dataAccess.executeQuery(async (db) => {
        let cursor = await db.collection('Communities').find({
            $or: [
                {users: {$in: [userId]}},
                {owner: userId},
            ]
        });
        for await (const doc of cursor) {
            communities.push(doc);
        }
    });

    return communities;
}


export default {createCommunity, sharePlaylist, getCommunity, getMyCommunities, editCommunity};
