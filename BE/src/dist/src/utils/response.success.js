"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATED = exports.OK = void 0;
const httpStatusCode_1 = require("../httpStatusCode");
class SuccessResponse {
    constructor(metadata, message, statusCode) {
        this.statusCode = statusCode;
        this.message = message;
        this.metadata = metadata;
    }
    send(res) {
        return res.status(this.statusCode || 200).json({
            statusCode: this.statusCode,
            message: this.message,
            metadata: this.metadata,
        });
    }
}
class OK extends SuccessResponse {
    constructor(metadata = [], message = httpStatusCode_1.reasonPhrases.OK, statusCode = httpStatusCode_1.statusCodes.OK) {
        super(metadata, message, statusCode);
    }
}
exports.OK = OK;
class CREATED extends SuccessResponse {
    constructor(metadata = [], message = httpStatusCode_1.reasonPhrases.CREATED, statusCode = httpStatusCode_1.statusCodes.CREATED) {
        super(metadata, message, statusCode);
    }
}
exports.CREATED = CREATED;
