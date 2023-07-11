import { NextFunction, Request, Response } from 'express';
const axios = require('axios');
export const getDistance = async (req: Request | any, res: Response, next: NextFunction) => {
    const apiKey = 'AIzaSyAzaga_IWnHVoBVEMGXazTE3HbFZ_uBkg4';
    const origin = req.query.origin;
    const destination = req.query.destination;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
    await axios
        .get(url)
        .then((response: any) => {
            res.header('Access-Control-Allow-Origin', '*');
            req.distance = response.data.rows[0].elements[0].distance.value;
            next();
        })
        .catch((error: any) => {
            res.status(500).json({ error: 'Đã xảy ra lỗi' });
        });
};
