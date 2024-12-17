//! INFORMACION: 
//? En cada respuesta de error, se reemplazaron los mensajes de error y códigos de estado por los correspondientes de ERROR_CODES y ERROR_MESSAGES:
//? Se utilizó ERROR_CODES.NOT_FOUND y ERROR_MESSAGES.CART_NOT_FOUND para los casos donde no se encuentra el carrito.
//? Se utilizó ERROR_CODES.INTERNAL_SERVER_ERROR y ERROR_MESSAGES.SERVER_ERROR para manejar errores internos del servidor.

import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from '../controllers/cart.controller.js';
import Cart from '../models/cart.model.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

const router = Router();

router.use(isAuthenticated);

// router.get('/', getCart);
router.get('/:cid', getCart);
router.post('/add', addToCart);
router.delete('/remove/:itemId', removeFromCart);
router.put('/update/:itemId', updateCartItem);
router.delete('/clear', clearCart);

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const userCart = await Cart.findOne({ user: req.user.userId });
        if (!userCart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        res.json(userCart);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        const productIndex = cart.items.findIndex(item => item.product.toString() === pid);
        if (productIndex > -1) {
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({ product: pid, quantity });
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findByIdAndDelete(cid);
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        res.status(200).json({ message: "Carrito eliminado con éxito" });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        cart.items = cart.items.filter(item => item.product.toString() !== pid);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
});

export default router;


