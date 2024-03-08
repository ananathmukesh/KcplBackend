const httpstatus = require('../util/httpstatus');
const db = require("../database/db");
const Jwt = require('jsonwebtoken');

const AuthToken = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization || req.headers.Authorization; // Case-insensitive check
    console.log('authorizationHeader', authorizationHeader);

    if (!authorizationHeader) {
        return res.send(httpstatus.errorRespone({ message: "Token is missing" }));
    }

    try {
        // Extract the token from the "Bearer" prefix
        const token = authorizationHeader.split(' ')[1];

        const decoded = Jwt.verify(token, process.env.ACTIVATION_SECRET);
        const user = await db('users').select('*').where({ id: decoded.id }).first();

        if (!user) {
            return res.send(httpstatus.notFoundResponse({ message: "User not found" }));
        }

        req.user = user;
        next();
    } catch (error) {
        return res.send(httpstatus.invalidResponse({ message: "Invalid token" }));
    }
};

module.exports = AuthToken;
