"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageNotify = void 0;
const messageNotify = (params = {}, title = 'notify', body = 'This is notify') => {
    return Object.assign({ title,
        body }, params);
};
exports.messageNotify = messageNotify;
