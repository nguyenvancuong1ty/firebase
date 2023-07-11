import { NextFunction, Request, Response } from 'express';
import { statusCodes, reasonPhrases } from '../httpStatusCode';

class SuccessResponse {
    message: string;
    statusCode: number;
    metadata: object;

    constructor(metadata: object, message: string, statusCode: number) {
        this.statusCode = statusCode;
        this.message = message;
        this.metadata = metadata;
    }

    send(res: Response) {
        return res.status(this.statusCode || 200).json({
            statusCode: this.statusCode,
            message: this.message,
            metadata: this.metadata,
        });
    }
}

export class OK extends SuccessResponse {
    constructor(metadata: object = [], message: string = reasonPhrases.OK, statusCode: number = statusCodes.OK) {
        super(metadata, message, statusCode);
    }
}

export class CREATED extends SuccessResponse {
    constructor(
        metadata: object = [],
        message: string = reasonPhrases.CREATED,
        statusCode: number = statusCodes.CREATED,
    ) {
        super(metadata, message, statusCode);
    }
}
