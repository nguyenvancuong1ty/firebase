"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.authentication = void 0;
const response_error_1 = require("../utils/response.error");
const jwt = require('jsonwebtoken');
const authentication = (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : false;
    if (!token) {
        return new response_error_1.UnAuthorized('Missing token. Authorization denied.').send(res);
    }
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (decoded) {
            next();
        }
        else {
            return new response_error_1.UnAuthorized('Missing token. Authorization denied.').send(res);
        }
    });
};
exports.authentication = authentication;
const refreshToken = (req, res) => {
    const secretKey = process.env.SECRET;
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }
        else {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid refresh token' });
                }
                // Tạo mới Access Token
                const accessToken = jwt.sign({ email: decoded.email, role: req.query.type_account }, secretKey, {
                    expiresIn: '30m',
                });
                return res.json({ accessToken });
            });
        }
    }
    catch (e) {
        return res.json({ error: e });
    }
};
exports.refreshToken = refreshToken;
