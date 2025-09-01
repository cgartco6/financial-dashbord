const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API endpoint to get cryptocurrency data
app.get('/api/cryptocurrency/data', async (req, res) => {
    try {
        const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=20', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`CoinMarketCap API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
    }
});

// API endpoint to get global metrics
app.get('/api/cryptocurrency/global-metrics', async (req, res) => {
    try {
        const response = await fetch('https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`CoinMarketCap API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching global metrics:', error);
        res.status(500).json({ error: 'Failed to fetch global metrics' });
    }
});

// API endpoint to get fear and greed index (from alternative source)
app.get('/api/fear-greed-index', async (req, res) => {
    try {
        // This is a placeholder - you would need to use an actual API for fear and greed index
        // For now, we'll return a simulated value
        res.json({
            value: Math.floor(Math.random() * 100) + 1,
            value_classification: Math.random() > 0.5 ? 'Greed' : 'Fear',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching fear and greed index:', error);
        res.status(500).json({ error: 'Failed to fetch fear and greed index' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
