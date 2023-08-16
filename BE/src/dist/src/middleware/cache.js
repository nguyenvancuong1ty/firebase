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
exports.saveDataToCache = exports.client = exports.cache = void 0;
const { createClient } = require('redis');
const response_success_1 = require("../utils/response.success");
const client = createClient();
exports.client = client;
const cache = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        !client.isOpen && (yield client.connect());
        const key = '__express__' + (req.originalUrl || req.url);
        const data = yield client.get(key);
        if (data) {
            yield client.disconnect();
            return new response_success_1.OK(JSON.parse(data)).send(res);
        }
        else {
            next();
        }
    }
    catch (error) {
        console.log('lỗi');
        client.isOpen && (yield client.disconnect());
        next();
    }
});
exports.cache = cache;
const saveDataToCache = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (Boolean(client.isOpen)) {
        yield client.set('__express__' + (req.originalUrl || req.url), JSON.stringify(data));
        yield client.disconnect();
    }
});
exports.saveDataToCache = saveDataToCache;
