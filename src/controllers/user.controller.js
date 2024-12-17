import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

config();

const jwtSecret = process.env.JWT_SECRET;

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(ERROR_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.USER_ALREADY_EXISTS });
        }

        const user = new User({ first_name, last_name, email, age, password });
        await user.save();

        const newCart = new Cart({ user: user._id, items: [] });
        await newCart.save();

        user.cart = newCart._id;
        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        // Definir tiempo de expiración de la cookie usando multiplicaciones sucesivas
        const oneHour = 1000 * 60 * 60; // 1 hora en milisegundos

        // Guardar el token en una cookie con la duración establecida
        res.cookie('token', token, { httpOnly: true, maxAge: oneHour });

        // Información adicional del usuario que quieres devolver
        const userInfo = {
            userId: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };

        // Enviar respuesta con el mensaje, información del usuario, token, y URL de redirección
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: userInfo,
            token: token,    // Enviar el token también si es necesario
            redirectUrl: '/api/sessions/current'
        });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(ERROR_CODES.UNAUTHORIZED).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
        }

        if (!user.cart) {
            const newCart = new Cart({ user: user._id, items: [] });
            await newCart.save();
            user.cart = newCart._id;
            await user.save();
        }

        const token = jwt.sign(
            {
                userId: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        // Definir tiempo de expiración de la cookie usando multiplicaciones sucesivas
        const oneHour = 1000 * 60 * 60; // 1 hora en milisegundos

        // Guardar el token en una cookie con la duración establecida
        res.cookie('token', token, { httpOnly: true, maxAge: oneHour });

        const userInfo = {
            userId: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: userInfo,
            token: token,
            redirectUrl: '/api/sessions/current'
        });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout exitoso', redirectUrl: '/login' });
};

export const getCurrentUser = async (req, res) => {
    res.json({ user: req.user });
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        res.json(user);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, email, age } = req.body;
        const user = await User.findByIdAndUpdate(req.user.userId,
            { first_name, last_name, email, age },
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        res.json(user);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};
