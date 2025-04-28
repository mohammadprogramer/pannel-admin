document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loader = document.getElementById('loader');
    
    // Crypto data
    let cryptoData = [];
    let prices = {};
    
    // Initialize the app
    init();
    
    function init() {
        // Setup tabs
        setupTabs();
        
        // Setup dropdowns
        setupDropdown('buy-crypto-select', 'buy-crypto-options');
        setupDropdown('sell-crypto-select', 'sell-crypto-options');
        
        // Load crypto data
        loadCryptoData();
        
        // Setup event listeners for calculations
        setupCalculations();
    }
    
    function setupTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
    
    function setupDropdown(selectId, optionsId) {
        const select = document.getElementById(selectId);
        const optionsContainer = select.nextElementSibling;
        const optionsList = document.getElementById(optionsId);
        const searchInput = optionsContainer.querySelector('input');
        
        // Toggle dropdown
        select.addEventListener('click', function() {
            optionsContainer.classList.toggle('show');
        });
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const options = optionsList.querySelectorAll('.option');
            
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(searchTerm) ? 'flex' : 'none';
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!select.contains(e.target) {
                optionsContainer.classList.remove('show');
            }
        });
    }
    
    function loadCryptoData() {
        showLoader();
        
        // In a real app, you would fetch this from your API
        // This is a mock data for demonstration
        setTimeout(() => {
            cryptoData = [
                { symbol: 'BTC', name: 'بیت کوین', image: 'https://cdn.xpay.co/coins/BTC.png', price: 2500000000 },
                { symbol: 'ETH', name: 'اتریوم', image: 'https://cdn.xpay.co/coins/ETH.png', price: 180000000 },
                { symbol: 'USDT', name: 'تتر', image: 'https://cdn.xpay.co/coins/USDT.png', price: 58000 },
                { symbol: 'XRP', name: 'ریپل', image: 'https://cdn.xpay.co/coins/XRP.png', price: 3500 },
                { symbol: 'DOGE', name: 'دوج کوین', image: 'https://cdn.xpay.co/coins/DOGE.png', price: 800 },
                { symbol: 'ADA', name: 'کاردانو', image: 'https://cdn.xpay.co/coins/ADA.png', price: 2500 },
                { symbol: 'SOL', name: 'سولانا', image: 'https://cdn.xpay.co/coins/SOL.png', price: 350000 },
                { symbol: 'DOT', name: 'پولکادات', image: 'https://cdn.xpay.co/coins/DOT.png', price: 45000 }
            ];
            
            // Create prices object for quick lookup
            cryptoData.forEach(crypto => {
                prices[crypto.symbol] = crypto.price;
            });
            
            // Populate dropdowns
            populateDropdown('buy-crypto-options');
            populateDropdown('sell-crypto-options');
            
            // Display prices
            displayPrices();
            
            hideLoader();
        }, 1000);
    }
    
    function populateDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = '';
        
        cryptoData.forEach(crypto => {
            const option = document.createElement('div');
            option.className = 'option';
            option.innerHTML = `
                <img src="${crypto.image}" alt="${crypto.symbol}">
                <span class="name">${crypto.name}</span>
                <span class="symbol">${crypto.symbol}</span>
            `;
            
            option.addEventListener('click', function() {
                const selectId = dropdownId === 'buy-crypto-options' ? 'buy-crypto-select' : 'sell-crypto-select';
                const select = document.getElementById(selectId);
                
                select.innerHTML = `
                    <img src="${crypto.image}" alt="${crypto.symbol}">
                    <span>${crypto.symbol}</span>
                `;
                
                select.nextElementSibling.classList.remove('show');
                
                // Recalculate
                if (selectId === 'buy-crypto-select') {
                    calculateBuy();
                } else {
                    calculateSell();
                }
            });
            
            dropdown.appendChild(option);
        });
    }
    
    function displayPrices() {
        const container = document.getElementById('prices-container');
        container.innerHTML = '';
        
        cryptoData.forEach(crypto => {
            const priceItem = document.createElement('div');
            priceItem.className = 'price-item';
            priceItem.innerHTML = `
                <div class="price-name">
                    <img src="${crypto.image}" alt="${crypto.symbol}">
                    <span>${crypto.name} (${crypto.symbol})</span>
                </div>
                <div class="price-value">${crypto.price.toLocaleString()} تومان</div>
            `;
            
            container.appendChild(priceItem);
        });
    }
    
    function setupCalculations() {
        // Buy calculation
        const buyAmountInput = document.getElementById('buy-amount');
        buyAmountInput.addEventListener('input', function() {
            formatNumberInput(this);
            calculateBuy();
        });
        
        // Sell calculation
        const sellAmountInput = document.getElementById('sell-amount');
        sellAmountInput.addEventListener('input', function() {
            formatNumberInput(this);
            calculateSell();
        });
    }
    
    function calculateBuy() {
        const amountInput = document.getElementById('buy-amount');
        const cryptoSelect = document.getElementById('buy-crypto-select');
        const resultElement = document.getElementById('buy-result');
        
        const amount = parseFloat(amountInput.value.replace(/,/g, '')) || 0;
        const cryptoSymbol = cryptoSelect.querySelector('span').textContent;
        const cryptoPrice = prices[cryptoSymbol] || 1;
        
        // Calculate with 1% fee
        const result = (amount / cryptoPrice) * 0.99;
        resultElement.textContent = result.toFixed(8);
    }
    
    function calculateSell() {
        const amountInput = document.getElementById('sell-amount');
        const cryptoSelect = document.getElementById('sell-crypto-select');
        const resultElement = document.getElementById('sell-result');
        
        const amount = parseFloat(amountInput.value.replace(/,/g, '')) || 0;
        const cryptoSymbol = cryptoSelect.querySelector('span').textContent;
        const cryptoPrice = prices[cryptoSymbol] || 1;
        
        // Calculate with 1% fee
        const result = (amount * cryptoPrice) * 0.99;
        resultElement.textContent = result.toLocaleString();
    }
    
    function formatNumberInput(input) {
        // Remove non-numeric characters
        let value = input.value.replace(/[^0-9]/g, '');
        
        // Add commas as thousand separators
        if (value.length > 0) {
            value = parseInt(value).toLocaleString('en-US');
        }
        
        input.value = value;
    }
    
    function showLoader() {
        loader.style.display = 'flex';
    }
    
    function hideLoader() {
        loader.style.display = 'none';
    }
    
    // Setup buy/sell buttons
    document.getElementById('buy-btn').addEventListener('click', function() {
        alert('در حال انتقال به صفحه پرداخت...');
    });
    
    document.getElementById('sell-btn').addEventListener('click', function() {
        alert('در حال انتقال به صفحه فروش...');
    });
});