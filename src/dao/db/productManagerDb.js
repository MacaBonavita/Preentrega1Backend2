import Product from '../../models/product.model.js';

class ProductManager {
    async getProducts(page = 1, limit = 10, sort = 'createdAt') {
        try {
            const options = {
                page: page,
                limit: limit,
                sort: { [sort]: 1 },
                lean: true
            };

            const result = await Product.paginate({}, options);
            return result;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id).lean();
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            const newProduct = new Product(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error('Error al añadir producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updateData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).lean();
            if (!updatedProduct) {
                throw new Error('Producto no encontrado');
            }
            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id).lean();
            if (!deletedProduct) {
                throw new Error('Producto no encontrado');
            }
            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

export default ProductManager;