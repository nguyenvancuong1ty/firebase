import { NextFunction, Request, Response } from 'express';
import { statusCodes, reasonPhrases } from '../httpStatusCode';

class CustomError extends Error {
    statusCode: number;
    stack?: string;

    constructor(message: string, statusCode: number, stack?: string) {
        super(message);
        this.statusCode = statusCode;
        this.stack = stack;
    }

    send(res: Response) {
        return res.status(this.statusCode).json({
            statusCode: this.statusCode,
            message: this.message,
        });
    }
}

export class Conflict extends CustomError {
    constructor(message: string = reasonPhrases.CONFLICT, statusCode: number = statusCodes.CONFLICT, stack?: string) {
        super(message, statusCode);
    }
}
export class UnAuthorized extends CustomError {
    constructor(
        message: string = reasonPhrases.UNAUTHORIZED,
        statusCode: number = statusCodes.UNAUTHORIZED,
        stack?: string,
    ) {
        super(message, statusCode);
    }
}

export class NotFound extends CustomError {
    constructor(message: string = reasonPhrases.NOT_FOUND, statusCode: number = statusCodes.NOT_FOUND, stack?: string) {
        super(message, statusCode, stack);
    }
}

export class FORBIDDEN extends CustomError {
    constructor(message: string = reasonPhrases.FORBIDDEN, statusCode: number = statusCodes.FORBIDDEN, stack?: string) {
        super(message, statusCode, stack);
    }
}

export class INTERNAL_SERVER_ERROR extends CustomError {
    constructor(
        message: string = reasonPhrases.INTERNAL_SERVER_ERROR,
        statusCode: number = statusCodes.INTERNAL_SERVER_ERROR,
        stack?: string,
    ) {
        super(message, statusCode, stack);
    }
}

export function handleError(callback: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
        await callback(req, res, next).catch((e: Error) => {
            next(e);
        });
    };
}
