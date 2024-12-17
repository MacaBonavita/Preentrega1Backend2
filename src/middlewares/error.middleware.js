import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || ERROR_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};

export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = ERROR_CODES.NOT_FOUND; 
    next(error);
};
