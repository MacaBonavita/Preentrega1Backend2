document.addEventListener('DOMContentLoaded', () => {
    // Funcionalidad para añadir al carrito
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.dataset.id;
            try {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId, quantity: 1 }),
                });
                if (response.ok) {
                    alert('Producto añadido al carrito');
                } else {
                    throw new Error('Error al añadir al carrito');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al añadir al carrito');
            }
        });
    });

    // Funcionalidad para actualizar cantidad en el carrito
    const quantityControls = document.querySelectorAll('.quantity-control');
    quantityControls.forEach(control => {
        const decreaseBtn = control.querySelector('.btn-decrease');
        const increaseBtn = control.querySelector('.btn-increase');
        const quantitySpan = control.querySelector('.quantity');

        decreaseBtn.addEventListener('click', () => updateQuantity(control, -1));
        increaseBtn.addEventListener('click', () => updateQuantity(control, 1));
    });

    async function updateQuantity(control, change) {
        const itemId = control.dataset.id;
        const quantitySpan = control.querySelector('.quantity');
        let newQuantity = parseInt(quantitySpan.textContent) + change;
        if (newQuantity < 1) newQuantity = 1;

        try {
            const response = await fetch(`/api/cart/update/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            if (response.ok) {
                quantitySpan.textContent = newQuantity;
                updateCartTotal();
            } else {
                throw new Error('Error al actualizar la cantidad');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar la cantidad');
        }
    }

    // Funcionalidad para eliminar del carrito
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const itemId = e.target.dataset.id;
            try {
                const response = await fetch(`/api/cart/remove/${itemId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    e.target.closest('.cart-item').remove();
                    updateCartTotal();
                } else {
                    throw new Error('Error al eliminar del carrito');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar del carrito');
            }
        });
    });

    function updateCartTotal() {
        // Lógica para recalcular y actualizar el total del carrito
        // Esta función debería ser implementada según la estructura de tu carrito
    }
});