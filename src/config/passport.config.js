// src/config/passport.config.js
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { config } from "dotenv";
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
config();

const jwtSecret = process.env.JWT_SECRET;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

const JWTOpctions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: jwtSecret
};

const initializePassport = () => {
    // Estrategia JWT para autenticación con token
    passport.use("current", new JwtStrategy(JWTOpctions, async (jwt_payload, done) => {
        try {
            // El objeto completo del usuario (excepto contraseña) está en jwt_payload
            return done(null, jwt_payload);
        } catch (error) {
            return done(error, false);
        }
    }));

    // Estrategia GitHub para autenticación social
    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile._json.email });
            if (!user) {
                // Crear nuevo usuario si no existe
                user = new User({
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: '', // Contraseña vacía ya que es autenticación con GitHub
                    age: 18, // Valor por defecto
                });
                await user.save();

                // Crear carrito para el nuevo usuario
                const newCart = new Cart({ user: user._id, items: [] });
                await newCart.save();

                user.cart = newCart._id;
                await user.save();
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serialización del usuario en la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserialización del usuario de la sesión
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;
