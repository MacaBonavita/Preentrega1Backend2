import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

config();

const jwtSecret = process.env.JWT_SECRET;

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) {
        return res.status(ERROR_CODES.UNAUTHORIZED).redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.status(ERROR_CODES.UNAUTHORIZED).redirect('/login');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(ERROR_CODES.FORBIDDEN).json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
    }
};

export const checkUserSession = (req, res, next) => {
    const token = req.cookies['token'];

    if (!token) {
        return next();
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return next();
        }

        return res.redirect('/api/sessions/current');
    });
};
