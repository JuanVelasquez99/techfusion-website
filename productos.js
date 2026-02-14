// Product Management System
class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        this.filters = {
            minPrice: null,
            maxPrice: null,
            brands: [],
            storage: [],
            ram: []
        };
        this.sortBy = 'name';
        this.init();
    }

    init() {
        this.renderFilterOptions();
        this.renderProducts();
        this.attachEventListeners();
    }

    loadProducts() {
        const stored = localStorage.getItem('techfusion_products');
        if (stored) {
            return JSON.parse(stored);
        }
        // Sample products
        return [
            {
                id: 1,
                name: "Laptop Dell Inspiron 15",
                brand: "Dell",
                price: 2500000,
                storage: "512GB SSD",
                ram: "16GB",
                image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%231C9CD4' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3ELaptop Dell%3C/text%3E%3C/svg%3E",
                description: "Laptop potente para trabajo y entretenimiento"
            },
            {
                id: 2,
                name: "HP Pavilion Gaming",
                brand: "HP",
                price: 3200000,
                storage: "1TB SSD",
                ram: "32GB",
                image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%2300C8DC' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EHP Gaming%3C/text%3E%3C/svg%3E",
                description: "Laptop gaming de alto rendimiento"
            },
            {
                id: 3,
                name: "Lenovo ThinkPad X1",
                brand: "Lenovo",
                price: 4500000,
                storage: "512GB SSD",
                ram: "16GB",
                image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%231E2761' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EThinkPad%3C/text%3E%3C/svg%3E",
                description: "Laptop profesional para negocios"
            },
            {
                id: 4,
                name: "Asus ROG Strix",
                brand: "Asus",
                price: 5800000,
                storage: "1TB SSD",
                ram: "32GB",
                image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23363636' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EROG Strix%3C/text%3E%3C/svg%3E",
                description: "Gaming extremo con RTX 4070"
            }
        ];
    }

    saveProducts() {
        localStorage.setItem('techfusion_products', JSON.stringify(this.products));
    }

    getFilteredProducts() {
        return this.products.filter(product => {
            // Price filter
            if (this.filters.minPrice && product.price < this.filters.minPrice) return false;
            if (this.filters.maxPrice && product.price > this.filters.maxPrice) return false;
            
            // Brand filter
            if (this.filters.brands.length > 0 && !this.filters.brands.includes(product.brand)) return false;
            
            // Storage filter
            if (this.filters.storage.length > 0 && !this.filters.storage.includes(product.storage)) return false;
            
            // RAM filter
            if (this.filters.ram.length > 0 && !this.filters.ram.includes(product.ram)) return false;
            
            return true;
        });
    }

    getSortedProducts(products) {
        const sorted = [...products];
        switch (this.sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name':
            default:
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    renderFilterOptions() {
        // Get unique values
        const brands = [...new Set(this.products.map(p => p.brand))];
        const storages = [...new Set(this.products.map(p => p.storage))];
        const rams = [...new Set(this.products.map(p => p.ram))];

        // Render brand filters
        const brandFilters = document.getElementById('brandFilters');
        brandFilters.innerHTML = brands.map(brand => `
            <div class="filter-option">
                <input type="checkbox" id="brand-${brand}" value="${brand}" data-filter="brand">
                <label for="brand-${brand}">${brand}</label>
            </div>
        `).join('');

        // Render storage filters
        const storageFilters = document.getElementById('storageFilters');
        storageFilters.innerHTML = storages.map(storage => `
            <div class="filter-option">
                <input type="checkbox" id="storage-${storage}" value="${storage}" data-filter="storage">
                <label for="storage-${storage}">${storage}</label>
            </div>
        `).join('');

        // Render RAM filters
        const ramFilters = document.getElementById('ramFilters');
        ramFilters.innerHTML = rams.map(ram => `
            <div class="filter-option">
                <input type="checkbox" id="ram-${ram}" value="${ram}" data-filter="ram">
                <label for="ram-${ram}">${ram}</label>
            </div>
        `).join('');
    }

    renderProducts() {
        const filtered = this.getFilteredProducts();
        const sorted = this.getSortedProducts(filtered);
        const grid = document.getElementById('productsGrid');
        const noProducts = document.getElementById('noProducts');
        const count = document.getElementById('productCount');

        count.textContent = sorted.length;

        if (sorted.length === 0) {
            grid.style.display = 'none';
            noProducts.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        noProducts.style.display = 'none';

        grid.innerHTML = sorted.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-specs">${product.ram} RAM | ${product.storage}</div>
                    <div class="product-price">$${product.price.toLocaleString('es-CO')}</div>
                    <div class="product-actions">
                        <button class="btn-quote" onclick="productManager.requestQuote('${product.name}')">
                            Solicitar Cotización
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    requestQuote(productName) {
        const message = `Hola, me interesa cotizar: ${productName}`;
        const whatsappUrl = `https://wa.me/573116152792?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    attachEventListeners() {
        // Price filter
        document.getElementById('applyPrice').addEventListener('click', () => {
            const min = document.getElementById('minPrice').value;
            const max = document.getElementById('maxPrice').value;
            this.filters.minPrice = min ? parseInt(min) : null;
            this.filters.maxPrice = max ? parseInt(max) : null;
            this.renderProducts();
        });

        // Checkbox filters
        document.querySelectorAll('[data-filter]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const filterType = e.target.dataset.filter;
                const value = e.target.value;
                
                if (e.target.checked) {
                    this.filters[filterType + 's'].push(value);
                } else {
                    this.filters[filterType + 's'] = this.filters[filterType + 's'].filter(v => v !== value);
                }
                this.renderProducts();
            });
        });

        // Sort
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderProducts();
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.filters = {
                minPrice: null,
                maxPrice: null,
                brands: [],
                storage: [],
                ram: []
            };
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            document.querySelectorAll('[data-filter]').forEach(cb => cb.checked = false);
            this.renderProducts();
        });
    }
}

// Initialize when DOM is ready
let productManager;
if (document.getElementById('productsGrid')) {
    productManager = new ProductManager();
}
