import bcrypt from 'bcrypt';

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

export const generateUniqueCode = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

export const paginate = (items, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < items.length) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        };
    }

    results.results = items.slice(startIndex, endIndex);

    return results;
};