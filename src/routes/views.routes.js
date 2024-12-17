import { Router } from 'express';
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import ProductManager from '../dao/db/productManagerDb.js';
import CartManager from '../dao/db/cartManagerDb.js';
import { isAuthenticated, checkUserSession, isAdmin } from '../middlewares/auth.middleware.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({
                status: "error",
                message: ERROR_MESSAGES.CART_NOT_FOUND
            });
        }

        const cartProducts = cart.products.map(item => {
            let thumbnailArray = [];
            item.product.thumbnails.forEach(img => {
                thumbnailArray.push(img);
            });

            return {
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                thumbnail: thumbnailArray
            };
        });

        res.render('cart', {
            cartId: cid,
            products: cartProducts,
            totalItems: cart.products.length,
        });

    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: ERROR_MESSAGES.SERVER_ERROR
        });
    }
});

router.get('/products/:id', isAuthenticated, async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        if (!product) {
            return res.status(ERROR_CODES.NOT_FOUND).render('error', { message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.render('productDetails', { product, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).render('error', { message: ERROR_MESSAGES.SERVER_ERROR });
    }
});

router.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
});

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts(1, 8);
        res.render('home', { products: products.docs, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).render('error', { message: ERROR_MESSAGES.SERVER_ERROR });
    }
});

router.get('/products', isAuthenticated, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const sort = req.query.sort || 'createdAt';
        const products = await productManager.getProducts(page, limit, sort);
        res.render('products', {
            products: products.docs,
            pagination: {
                page: products.page,
                totalPages: products.totalPages,
                hasNextPage: products.hasNextPage,
                hasPrevPage: products.hasPrevPage,
                nextPage: products.nextPage,
                prevPage: products.prevPage
            },
            user: req.user,
            sort: sort
        });
    } catch (error) {
        console.error(error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).render('error', { message: ERROR_MESSAGES.SERVER_ERROR });
    }
});

router.get('/cart', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('cart');
        if (!user || !user.cart) {
            return res.status(ERROR_CODES.NOT_FOUND).render('error', { message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        const cart = await Cart.findById(user.cart).populate('items.product');
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).render('error', { message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        res.render('cart', {
            cart: cart,
            user: req.user,
            cartItems: cart.items.map(item => ({
                ...item.toObject(),
                product: item.product.toObject()
            }))
        });
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).render('error', { message: ERROR_MESSAGES.SERVER_ERROR });
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

export default router;
