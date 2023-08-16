"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const { google } = require('googleapis');
require('dotenv').config();
// create OAuth2 client
const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'https://developers.google.com/oauthplayground');
const getAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });
    // get new access token from refresh token
    const token = yield new Promise((resolve, reject) => {
        oauth2Client.getAccessToken(function (err, token) {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
    return token;
});
exports.getAccessToken = getAccessToken;
