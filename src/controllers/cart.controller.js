import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

export const getCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('items.product');
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            cart = new Cart({ user: req.user.userId, items: [] });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();
        res.json({ message: 'Item eliminado del carrito', cart });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        item.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        cart.items = [];
        await cart.save();
        res.json({ message: 'Carrito vaciado con éxito' });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};
