import Cart from '../../models/cart.model.js';

class CartManager {
    async getCartByUserId(userId) {
        try {
            let cart = await Cart.findOne({ user: userId }).populate('items.product');
            if (!cart) {
                cart = await this.createCart(userId);
            }
            return cart;
        } catch (error) {
            console.error('Error al obtener carrito:', error);
            throw error;
        }
    }

    async createCart(userId) {
        try {
            const newCart = new Cart({ user: userId, items: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }

    async addItemToCart(userId, productId, quantity) {
        try {
            const cart = await this.getCartByUserId(userId);
            const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al añadir item al carrito:', error);
            throw error;
        }
    }

    async removeItemFromCart(userId, itemId) {
        try {
            const cart = await this.getCartByUserId(userId);
            cart.items = cart.items.filter(item => item._id.toString() !== itemId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar item del carrito:', error);
            throw error;
        }
    }

    async updateItemQuantity(userId, itemId, quantity) {
        try {
            const cart = await this.getCartByUserId(userId);
            const item = cart.items.find(item => item._id.toString() === itemId);
            if (item) {
                item.quantity = quantity;
                await cart.save();
            }
            return cart;
        } catch (error) {
            console.error('Error al actualizar cantidad del item:', error);
            throw error;
        }
    }

    async clearCart(userId) {
        try {
            const cart = await this.getCartByUserId(userId);
            cart.items = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw error;
        }
    }
}

export default CartManager;