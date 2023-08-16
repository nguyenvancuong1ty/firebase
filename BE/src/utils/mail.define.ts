import { getAccessToken } from './auth2.0';

const nodemailer = require('nodemailer');
export const mailDefine = async () => {
    const accessToken: string = await getAccessToken();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            type: 'OAuth2',
            user: 'nguyenvancuong19032002@gmail.com', // generated ethereal user
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
    return transporter;
};
