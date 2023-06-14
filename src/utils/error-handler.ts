import {NextFunction, Request, Response} from "express";

class CustomError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

const ErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode: number = err.statusCode || 500;
    const message: string = err.message || 'Internal Server Error';

    res.status(statusCode).json({error: message});
    return next(err)
};

export {CustomError, ErrorHandler};
