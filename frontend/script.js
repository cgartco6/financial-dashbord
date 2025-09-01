// API base URL - change this to match your backend server
const API_BASE_URL = 'http://localhost:3001';

// Initialize charts and update time
document.addEventListener('DOMContentLoaded', function() {
    // Set initial update time
    updateTime();
    
    // Update time every minute
    setInterval(updateTime, 60000);
    
    // Initialize price ticker
    initializeTicker();
    
    // Bitcoin Dominance Chart
    const btcCtx = document.getElementById('btcChart').getContext('2d');
    const btcChart = new Chart(btcCtx, {
        type: 'line',
        data: {
            labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am', '3am', '6am'],
            datasets: [{
                label: 'BTC Dominance %',
                data: [52.8, 53.0, 52.7, 52.5, 52.3, 52.1, 52.0, 52.2, 52.5],
                borderColor: '#00d2ff',
                backgroundColor: 'rgba(0, 210, 255, 0.1)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#00d2ff',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
    
    // Fetch data from the backend API
    fetchData();
    
    // Set up interval to fetch data every 60 seconds
    setInterval(fetchData, 60000);
});

function updateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('update-time').textContent = now.toLocaleDateString('en-US', options);
}

function initializeTicker() {
    const ticker = document.getElementById('ticker');
    const assets = [
        {symbol: 'BTC', price: 67382, change: 2.4},
        {symbol: 'ETH', price: 3512, change: 3.1},
        {symbol: 'SOL', price: 152, change: 5.7},
        {symbol: 'ADA', price: 0.58, change: 2.8},
        {symbol: 'XRP', price: 0.62, change: 1.2},
        {symbol: 'DOT', price: 7.85, change: 3.7},
        {symbol: 'DOGE', price: 0.15, change: -1.2},
        {symbol: 'AVAX', price: 42.36, change: 8.3},
        {symbol: 'LINK', price: 18.24, change: 6.9},
        {symbol: 'MATIC', price: 0.92, change: 4.5},
        {symbol: 'BNB', price: 585, change: 2.1},
        {symbol: 'LTC', price: 85.42, change: 1.8},
        {symbol: 'UNI', price: 11.25, change: 3.4},
        {symbol: 'ATOM', price: 12.37, change: 2.9},
        {symbol: 'XLM', price: 0.13, change: 1.5},
        {symbol: 'ETC', price: 32.18, change: -0.4},
        {symbol: 'XMR', price: 165, change: 1.2},
        {symbol: 'ALGO', price: 0.23, change: 2.7},
        {symbol: 'BCH', price: 485, change: 1.9},
        {symbol: 'VET', price: 0.04, change: 3.2},
        {symbol: 'FIL', price: 8.42, change: 4.1},
        {symbol: 'THETA', price: 2.18, change: 2.3},
        {symbol: 'TRX', price: 0.12, change: 1.7},
        {symbol: 'EOS', price: 1.12, change: -0.8},
        {symbol: 'AAVE', price: 125, change: 3.8},
        {symbol: 'COMP', price: 87.5, change: 2.6},
        {symbol: 'MKR', price: 2850, change: 1.9},
        {symbol: 'XTZ', price: 1.24, change: 2.1},
        {symbol: 'SUSHI', price: 1.85, change: 4.3},
        {symbol: 'YFI', price: 11250, change: 2.7},
    ];
    
    // Duplicate the assets to make the ticker longer
    const allAssets = [...assets, ...assets, ...assets];
    
    allAssets.forEach(asset => {
        const tickerItem = document.createElement('div');
        tickerItem.className = 'ticker-item';
        
        const symbol = document.createElement('span');
        symbol.className = 'ticker-symbol';
        symbol.textContent = asset.symbol;
        
        const price = document.createElement('span');
        price.className = 'ticker-price';
        price.textContent = '$' + asset.price.toLocaleString();
        
        const change = document.createElement('span');
        change.className = 'ticker-change';
        change.classList.add(asset.change >= 0 ? 'positive' : 'negative');
        change.textContent = (asset.change >= 0 ? '+' : '') + asset.change.toFixed(2) + '%';
        
        tickerItem.appendChild(symbol);
        tickerItem.appendChild(price);
        tickerItem.appendChild(change);
        
        ticker.appendChild(tickerItem);
    });
}

async function fetchData() {
    try {
        // Show loading state
        document.getElementById('api-status').textContent = 'Fetching Data...';
        document.getElementById('api-status').className = 'api-status status-offline';
        document.getElementById('cmc-status').textContent = 'Fetching...';
        
        // Fetch cryptocurrency data
        const cryptoResponse = await fetch(`${API_BASE_URL}/api/cryptocurrency/data`);
        if (!cryptoResponse.ok) {
            throw new Error('Failed to fetch cryptocurrency data');
        }
        const cryptoData = await cryptoResponse.json();
        
        // Fetch global metrics
        const globalResponse = await fetch(`${API_BASE_URL}/api/cryptocurrency/global-metrics`);
        if (!globalResponse.ok) {
            throw new Error('Failed to fetch global metrics');
        }
        const globalData = await globalResponse.json();
        
        // Fetch fear and greed index
        const fearGreedResponse = await fetch(`${API_BASE_URL}/api/fear-greed-index`);
        if (!fearGreedResponse.ok) {
            throw new Error('Failed to fetch fear and greed index');
        }
        const fearGreedData = await fearGreedResponse.json();
        
        // Update the UI with the fetched data
        updateUIWithData(cryptoData, globalData, fearGreedData);
        
        // Update status
        document.getElementById('api-status').textContent = 'Live Data';
        document.getElementById('api-status').className = 'api-status status-live';
        document.getElementById('cmc-status').textContent = 'Live';
        
        updateTime();
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('api-status').textContent = 'API Error';
        document.getElementById('api-status').className = 'api-status status-offline';
        document.getElementById('cmc-status').textContent = 'Error';
    }
}

function updateUIWithData(cryptoData, globalData, fearGreedData) {
    // Update Bitcoin price and change
    const btc = cryptoData.data.find(coin => coin.symbol === 'BTC');
    if (btc) {
        document.getElementById('btc-price').textContent = `$${btc.quote.USD.price.toFixed(2)}`;
        const change = btc.quote.USD.percent_change_24h;
        document.getElementById('btc-change').textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
        document.getElementById('btc-change').className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
    
    // Update dominance values
    if (globalData.data) {
        const btcDominance = globalData.data.btc_dominance;
        const ethDominance = globalData.data.eth_dominance;
        const otherDominance = 100 - btcDominance - ethDominance;
        
        document.getElementById('btc-dominance').textContent = `${btcDominance.toFixed(1)}%`;
        document.getElementById('eth-dominance').textContent = `${ethDominance.toFixed(1)}%`;
        document.getElementById('other-dominance').textContent = `${otherDominance.toFixed(1)}%`;
        
        // Update altcoin season indicator
        const altcoinSeason = document.getElementById('altcoin-season');
        if (btcDominance < 40) {
            altcoinSeason.textContent = 'Yes';
            altcoinSeason.className = 'index-value season-yes';
        } else {
            altcoinSeason.textContent = 'No';
            altcoinSeason.className = 'index-value season-no';
        }
        
        // Update global metrics
        document.getElementById('total-marketcap').textContent = `$${(globalData.data.quote.USD.total_market_cap / 1e12).toFixed(2)}T`;
        document.getElementById('total-volume').textContent = `$${(globalData.data.quote.USD.total_volume_24h / 1e9).toFixed(0)}B`;
        document.getElementById('active-cryptos').textContent = globalData.data.active_cryptocurrencies.toLocaleString();
        document.getElementById('active-pairs').textContent = globalData.data.active_market_pairs.toLocaleString();
    }
    
    // Update fear and greed index
    if (fearGreedData) {
        document.getElementById('fear-greed-value').textContent = fearGreedData.value;
        document.getElementById('fear-greed-label').textContent = fearGreedData.value_classification;
        
        // Set color based on value
        const valueElement = document.getElementById('fear-greed-value');
        if (fearGreedData.value >= 75) {
            valueElement.className = 'index-value greed';
        } else if (fearGreedData.value >= 50) {
            valueElement.className = 'index-value neutral';
        } else {
            valueElement.className = 'index-value fear';
        }
    }
    
    // Update top cryptocurrencies
    const cryptoList = document.getElementById('crypto-prices');
    const topCryptos = cryptoData.data.slice(0, 4); // Get top 4 cryptocurrencies
    
    topCryptos.forEach((crypto, index) => {
        const listItem = cryptoList.children[index];
        const priceElement = listItem.querySelector('.asset-price');
        
        // Clear existing content
        priceElement.innerHTML = '';
        
        // Add price
        priceElement.textContent = `$${crypto.quote.USD.price.toFixed(2)} `;
        
        // Add change indicator
        const change = crypto.quote.USD.percent_change_24h;
        const changeElement = document.createElement('span');
        changeElement.classList.add('price-change');
        changeElement.classList.add(change >= 0 ? 'positive' : 'negative');
        changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
        
        priceElement.appendChild(changeElement);
    });
    
    // Update market caps for BTC and ETH
    const btcMarketCap = cryptoData.data.find(coin => coin.symbol === 'BTC').quote.USD.market_cap;
    const ethMarketCap = cryptoData.data.find(coin => coin.symbol === 'ETH').quote.USD.market_cap;
    
    document.getElementById('btc-marketcap').textContent = `$${(btcMarketCap / 1e9).toFixed(0)}B`;
    document.getElementById('eth-marketcap').textContent = `$${(ethMarketCap / 1e9).toFixed(0)}B`;
}
