// Shopping Cart Manager
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.products = this.loadProducts();
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartBadge();
    }

    loadCart() {
        const stored = localStorage.getItem('techfusion_cart');
        return stored ? JSON.parse(stored) : [];
    }

    loadProducts() {
        const stored = localStorage.getItem('techfusion_products');
        return stored ? JSON.parse(stored) : [];
    }

    saveCart() {
        localStorage.setItem('techfusion_cart', JSON.stringify(this.cart));
        this.updateCartBadge();
    }

    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(i => i.id === productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeItem(productId);
        } else {
            this.saveCart();
            this.renderCart();
        }
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
    }

    calculateSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    renderCart() {
        const emptyCart = document.getElementById('emptyCart');
        const cartContent = document.getElementById('cartContent');
        const cartItemsList = document.getElementById('cartItemsList');

        if (this.cart.length === 0) {
            emptyCart.style.display = 'block';
            cartContent.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartContent.style.display = 'grid';

        cartItemsList.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-brand">${item.brand}</div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString('es-CO')}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="btn-remove" onclick="cartManager.removeItem(${item.id})">Eliminar</button>
                    </div>
                </div>
                <div style="text-align: right; font-weight: 700; color: var(--dark-blue); font-size: 1.2rem;">
                    $${(item.price * item.quantity).toLocaleString('es-CO')}
                </div>
            </div>
        `).join('');

        this.updateSummary();
    }

    updateSummary() {
        const subtotal = this.calculateSubtotal();
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('total').textContent = `$${subtotal.toLocaleString('es-CO')}`;
    }
}

function goToCheckout() {
    window.location.href = 'checkout.html';
}

// Initialize
let cartManager;
if (document.getElementById('cartItemsList')) {
    cartManager = new CartManager();
}
