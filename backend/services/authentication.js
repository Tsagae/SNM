const jwt = require('jsonwebtoken');
const config = require('config');
const { matchedData, validationResult } = require('express-validator');

const authSecret = config.get('auth.secret');



// Registration
const registeredUsers = [];

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    else {
        const data = matchedData(req);
        const username = data.username;
        const password = data.password;
        const foundUser = registeredUsers.find((user) => { return user.username == username && user.password == password });
        if (foundUser != null) {
            return res.send(generateAccessToken({ username: username }));
        }
        return res.status(401).send("invalid login");
    }
}

exports.registerUser = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    else {
        const data = matchedData(req);
        const username = data.username;
        const password = data.password;
        registeredUsers.push({ username: username, password: password });
        return res.send(`registered successfully! ${username}`);
    }
}


/**
 * Generates a signed jwt token
 * @param {*} user 
 * @param {int} expiringTime in seconds 
 * @returns a signed jwt token 
 */
function generateAccessToken(user, expiringTime = 1800) {
    //console.log("expiration: ", expiringTime + 's');
    return jwt.sign(user, authSecret, { expiresIn: expiringTime + 's' });
}


exports.generateSecret = function () { return require('crypto').randomBytes(64).toString('hex') };



/*
exports.authenticateRequest = function (req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, authSecret, (err, user) => {

        if (err) {
            console.log(err);
            return res.status(403).send("invalid token");
        };

        req.user = user;

        res.status(200).send("token is valid, user: " + user.username + " email: " + user.email);
    });
}
*/

exports.authenticateRequest = function (req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    let tokenValidation;
    tokenValidation = authenticateToken(token);
    console.log(tokenValidation);
    if (tokenValidation == null) return res.sendStatus(401);
    if (tokenValidation.err != null) return res.status(403).send("invalid token");
    return res.send(tokenValidation.user);
}




/**
 * authenticates a token returning the user that requested the token or an error
 * @param {string} token authentication token 
 * @returns tokenValidation: {user, err}
 */
function authenticateToken(token) {
    if (token == null) return null;
    let tokenUser = { user: null, err: null };
    jwt.verify(token, authSecret, (err, user) => {

        if (err) {
            //console.log(err);
            tokenUser.err = err;
            return tokenUser
        };

        tokenUser.user = user;
    });
    return tokenUser;
}






