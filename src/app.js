import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./config/passport.config.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import config from './config/config.js';
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/session.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import ProductManager from './dao/db/productManagerDb.js';
import { fileURLToPath } from 'url';
import path from 'path';
import "./db.js";

const app = express();
const productManager = new ProductManager();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Configuración de la sesión
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongodbUri,
        ttl: 60 * 60 // 1 hora
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatNumber: (number, decimals = 2) => {
            if (number === null || number === undefined || isNaN(number)) {
                return 'N/A';
            }
            return Number(number).toFixed(decimals);
        },
        eq: (v1, v2) => v1 === v2,
        or: (v1, v2) => v1 || v2,
        and: (v1, v2) => v1 && v2,
        not: v => !v,
        ternary: (cond, v1, v2) => cond ? v1 : v2,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', viewsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const httpServer = app.listen(config.port, () => {
    console.log(`Server running on port http://localhost:${config.port}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    const initialProducts = await productManager.getProducts(1, 15);
    socket.emit('products', initialProducts);

    socket.on('requestPage', async ({ page, limit, sort }) => {
        const products = await productManager.getProducts(page, limit, sort);
        socket.emit('products', products);
    });
});

export default app;