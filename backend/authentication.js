

const jwt = require('jsonwebtoken');

exports.generateSecret = function () { return require('crypto').randomBytes(64).toString('hex') };

/**
 * Generates a signed jwt token
 * @param {string} username 
 * @param {string} secret 
 * @param {string} expiringTime in seconds 
 * @returns a signed jwt token 
 */
exports.generateAccessToken = function (username, secret, expiringTime = '1800') {
    //console.log("expiration: ", expiringTime + 's');
    return jwt.sign({ username: username, email: "prova mail" }, secret, { expiresIn: expiringTime + 's' });
}

exports.authenticateToken = function (req, res, secret) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secret, (err, user) => {

        if (err) {
            console.log(err);
            return res.status(403).send("invalid token");
        };

        req.user = user;

        res.status(200).send("token is valid, user: " + user.username + " email: " + user.email);
    });
}