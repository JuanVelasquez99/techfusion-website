// Checkout Manager
class CheckoutManager {
    constructor() {
        this.cart = this.loadCart();
        this.selectedPayment = null;
        this.init();
    }

    init() {
        if (this.cart.length === 0) {
            window.location.href = 'carrito.html';
            return;
        }
        this.renderOrderSummary();
        this.updateCartBadge();
    }

    loadCart() {
        const stored = localStorage.getItem('techfusion_cart');
        return stored ? JSON.parse(stored) : [];
    }

    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    calculateSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        
        if (this.selectedPayment === 'card') {
            const cardFee = Math.round(subtotal * 0.025);
            const transactionFee = 700;
            return subtotal + cardFee + transactionFee;
        }
        
        return subtotal;
    }

    renderOrderSummary() {
        const orderItems = document.getElementById('orderItems');
        orderItems.innerHTML = this.cart.map(item => `
            <div class="summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span style="font-weight: 600;">$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
            </div>
        `).join('');

        this.updateTotals();
    }

    updateTotals() {
        const subtotal = this.calculateSubtotal();
        const total = this.calculateTotal();

        document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
        document.getElementById('checkoutTotal').textContent = `$${total.toLocaleString('es-CO')}`;

        // Show/hide card fees
        const cardFeeRow = document.getElementById('cardFeeRow');
        const transactionFeeRow = document.getElementById('transactionFeeRow');
        const cardFeeNotice = document.getElementById('cardFeeNotice');
        const cardFeeElement = document.getElementById('cardFee');

        if (this.selectedPayment === 'card') {
            const cardFee = Math.round(subtotal * 0.025);
            cardFeeElement.textContent = `$${cardFee.toLocaleString('es-CO')}`;
            cardFeeRow.style.display = 'flex';
            transactionFeeRow.style.display = 'flex';
            cardFeeNotice.style.display = 'block';
        } else {
            cardFeeRow.style.display = 'none';
            transactionFeeRow.style.display = 'none';
            cardFeeNotice.style.display = 'none';
        }
    }

    setPaymentMethod(method) {
        this.selectedPayment = method;
        
        // Update UI
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        document.getElementById(`payment-${method}`).classList.add('selected');
        
        this.updateTotals();
    }

    validateForm() {
        const name = document.getElementById('customerName').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        const city = document.getElementById('customerCity').value.trim();

        if (!name || !email || !phone || !address || !city) {
            alert('Por favor completa todos los campos de información de contacto');
            return false;
        }

        if (!this.selectedPayment) {
            alert('Por favor selecciona un método de pago');
            return false;
        }

        return true;
    }

    getPaymentInstructions() {
        const paymentMethods = {
            'nequi': {
                name: 'Nequi',
                instructions: 'Número Nequi: 311 615 2792\nNombre: TechFusion S.A.S.'
            },
            'daviplata': {
                name: 'Daviplata',
                instructions: 'Número Daviplata: 311 615 2792\nNombre: TechFusion S.A.S.'
            },
            'bancolombia': {
                name: 'Transferencia Bancolombia',
                instructions: 'Cuenta Bancolombia: [Agregar número de cuenta]\nTipo: Ahorros\nNombre: TechFusion S.A.S.'
            },
            'card': {
                name: 'Tarjeta de Crédito',
                instructions: 'Pago procesado por Wompi (Próximamente)'
            }
        };

        return paymentMethods[this.selectedPayment] || { name: 'No seleccionado', instructions: '' };
    }

    async placeOrder() {
        if (!this.validateForm()) return;

        const name = document.getElementById('customerName').value;
        const email = document.getElementById('customerEmail').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;
        const city = document.getElementById('customerCity').value;

        const subtotal = this.calculateSubtotal();
        const total = this.calculateTotal();
        const payment = this.getPaymentInstructions();

        // Build order message for WhatsApp
        let message = `*NUEVO PEDIDO - TechFusion*\n\n`;
        message += `*CLIENTE:*\n`;
        message += `Nombre: ${name}\n`;
        message += `Email: ${email}\n`;
        message += `Teléfono: ${phone}\n`;
        message += `Dirección: ${address}\n`;
        message += `Ciudad: ${city}\n\n`;
        
        message += `*PRODUCTOS:*\n`;
        this.cart.forEach(item => {
            message += `• ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CO')}\n`;
        });
        
        message += `\n*RESUMEN:*\n`;
        message += `Subtotal: $${subtotal.toLocaleString('es-CO')}\n`;
        
        if (this.selectedPayment === 'card') {
            const cardFee = Math.round(subtotal * 0.025);
            message += `Comisión Tarjeta (2.5%): $${cardFee.toLocaleString('es-CO')}\n`;
            message += `Comisión Transacción: $700\n`;
        }
        
        message += `*TOTAL: $${total.toLocaleString('es-CO')}*\n\n`;
        message += `*MÉTODO DE PAGO: ${payment.name}*\n`;
        message += `${payment.instructions}`;

        // Send to WhatsApp
        const whatsappUrl = `https://wa.me/573116152792?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Clear cart and redirect
        setTimeout(() => {
            localStorage.removeItem('techfusion_cart');
            alert('¡Pedido enviado! Te contactaremos pronto para confirmar tu compra.');
            window.location.href = 'index.html';
        }, 1000);
    }
}

function updatePaymentMethod(method) {
    checkoutManager.setPaymentMethod(method);
}

function placeOrder() {
    checkoutManager.placeOrder();
}

// Initialize
let checkoutManager;
if (document.getElementById('orderItems')) {
    checkoutManager = new CheckoutManager();
}
