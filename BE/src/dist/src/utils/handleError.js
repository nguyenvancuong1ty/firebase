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
exports.handleError = exports.INTERNAL_SERVER_ERROR = exports.NotFound = exports.UnAuthorized = exports.Conflict = void 0;
const httpStatusCode_1 = require("../httpStatusCode");
class CustomError extends Error {
    constructor(message, statusCode, stack) {
        super(message);
        this.statusCode = statusCode;
        this.stack = stack;
    }
    send(res) {
        return res.status(this.statusCode).json({
            statusCode: this.statusCode,
            message: this.message,
        });
    }
}
class Conflict extends CustomError {
    constructor(message = httpStatusCode_1.reasonPhrases.CONFLICT, statusCode = httpStatusCode_1.statusCodes.CONFLICT, stack) {
        super(message, statusCode);
    }
}
exports.Conflict = Conflict;
class UnAuthorized extends CustomError {
    constructor(message = httpStatusCode_1.reasonPhrases.UNAUTHORIZED, statusCode = httpStatusCode_1.statusCodes.UNAUTHORIZED, stack) {
        super(message, statusCode);
    }
}
exports.UnAuthorized = UnAuthorized;
class NotFound extends CustomError {
    constructor(message = httpStatusCode_1.reasonPhrases.NOT_FOUND, statusCode = httpStatusCode_1.statusCodes.NOT_FOUND, stack) {
        super(message, statusCode, stack);
    }
}
exports.NotFound = NotFound;
class INTERNAL_SERVER_ERROR extends CustomError {
    constructor(message = httpStatusCode_1.reasonPhrases.INTERNAL_SERVER_ERROR, statusCode = httpStatusCode_1.statusCodes.INTERNAL_SERVER_ERROR, stack) {
        super(message, statusCode, stack);
    }
}
exports.INTERNAL_SERVER_ERROR = INTERNAL_SERVER_ERROR;
const handleError = (callback) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield callback(req, res, next).catch((e) => {
            next(e);
        });
    });
};
exports.handleError = handleError;
