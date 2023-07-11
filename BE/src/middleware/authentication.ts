import { NextFunction, Request, Response } from 'express';
import { UnAuthorized } from '../utils/response.error';
const jwt = require('jsonwebtoken');
const authentication = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : false;

    if (!token) {
        return new UnAuthorized('Missing token. Authorization denied.').send(res);
    }
    jwt.verify(token, process.env.SECRET, function (err: Error, decoded: any) {
        if (decoded) {
            next();
        } else {
            return new UnAuthorized('Missing token. Authorization denied.').send(res);
        }
    });
};
const refreshToken = (req: Request, res: Response) => {
    const secretKey = process.env.SECRET;
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Refresh token not found' });
        } else {
            jwt.verify(token, secretKey, (err: Error, decoded: any) => {
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
    } catch (e) {
        return res.json({ error: e });
    }
};
export { authentication, refreshToken };
