import { NextFunction, Request, Response } from 'express';
import { FORBIDDEN, UnAuthorized } from '../utils/response.error';

const jwt = require('jsonwebtoken');
export const authorization = (authority: any) => (req: Request | any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return new UnAuthorized('Missing token. Authorization denied.').send(res);
    }

    jwt.verify(token, process.env.SECRET, function (err: Error, decoded: any) {
        if (decoded) {
            if (authority.includes(decoded.role)) {
                next();
            } else return new FORBIDDEN('You do not have permission to access this resource.').send(res);
            res;
        } else if (err) {
            return new UnAuthorized('Missing token. Authorization denied.').send(res);
        }
    });
};
