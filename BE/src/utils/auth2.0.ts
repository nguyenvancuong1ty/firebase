const { google } = require('googleapis');
require('dotenv').config();

// create OAuth2 client
const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'https://developers.google.com/oauthplayground');

export const getAccessToken = async () => {
    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    // get new access token from refresh token
    const token = await new Promise<string>((resolve, reject) => {
        oauth2Client.getAccessToken(function (err: Error, token: string) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
    return token;
};
