from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv
from rate_limiter import RateLimiter
from error_handler import ErrorHandler
from security import SecurityMiddleware

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Apply security middleware
app.wsgi_app = SecurityMiddleware(app.wsgi_app)

# Initialize rate limiter
rate_limiter = RateLimiter(max_requests=100, time_window=3600)  # 100 requests per hour
error_handler = ErrorHandler()

# CoinMarketCap API configuration
CMC_API_KEY = os.getenv('CMC_API_KEY')
CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1'

# Cache for API responses
response_cache = {}
CACHE_DURATION = 60  # Cache for 60 seconds

@app.before_request
def before_request():
    # Apply rate limiting
    client_ip = request.remote_addr
    if not rate_limiter.is_allowed(client_ip):
        return jsonify({'error': 'Rate limit exceeded'}), 429

@app.route('/api/cryptocurrency/data', methods=['GET'])
def get_cryptocurrency_data():
    try:
        # Check cache first
        cache_key = 'crypto_data'
        if cache_key in response_cache and datetime.now() < response_cache[cache_key]['expiry']:
            return jsonify(response_cache[cache_key]['data'])
        
        # Fetch from CoinMarketCap API
        url = f'{CMC_BASE_URL}/cryptocurrency/listings/latest'
        parameters = {
            'start': '1',
            'limit': '20',
            'convert': 'USD'
        }
        headers = {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': CMC_API_KEY,
        }
        
        response = requests.get(url, headers=headers, params=parameters, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Cache the response
        response_cache[cache_key] = {
            'data': data,
            'expiry': datetime.now() + timedelta(seconds=CACHE_DURATION)
        }
        
        return jsonify(data)
        
    except requests.exceptions.RequestException as e:
        return error_handler.handle_api_error(e)
    except Exception as e:
        return error_handler.handle_generic_error(e)

@app.route('/api/cryptocurrency/global-metrics', methods=['GET'])
def get_global_metrics():
    try:
        # Check cache first
        cache_key = 'global_metrics'
        if cache_key in response_cache and datetime.now() < response_cache[cache_key]['expiry']:
            return jsonify(response_cache[cache_key]['data'])
        
        # Fetch from CoinMarketCap API
        url = f'{CMC_BASE_URL}/global-metrics/quotes/latest'
        headers = {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': CMC_API_KEY,
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Cache the response
        response_cache[cache_key] = {
            'data': data,
            'expiry': datetime.now() + timedelta(seconds=CACHE_DURATION)
        }
        
        return jsonify(data)
        
    except requests.exceptions.RequestException as e:
        return error_handler.handle_api_error(e)
    except Exception as e:
        return error_handler.handle_generic_error(e)

@app.route('/api/fear-greed-index', methods=['GET'])
def get_fear_greed_index():
    try:
        # This is a placeholder - in a real implementation, you would fetch from an actual API
        # For now, we'll return a simulated value
        data = {
            'value': 76,
            'value_classification': 'Greed',
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(data)
        
    except Exception as e:
        return error_handler.handle_generic_error(e)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true')
