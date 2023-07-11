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
exports.getDistance = void 0;
const axios = require('axios');
const getDistance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = 'AIzaSyAzaga_IWnHVoBVEMGXazTE3HbFZ_uBkg4';
    const origin = req.query.origin;
    const destination = req.query.destination;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
    yield axios
        .get(url)
        .then((response) => {
        res.header('Access-Control-Allow-Origin', '*');
        req.distance = response.data.rows[0].elements[0].distance.value;
        next();
    })
        .catch((error) => {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    });
});
exports.getDistance = getDistance;
