from flask import jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

class ErrorHandler:
    def handle_api_error(self, error):
        logger.error(f"API error: {str(error)}")
        
        if hasattr(error, 'response') and error.response:
            status_code = error.response.status_code
            message = f"API error: {status_code}"
            
            if status_code == 401:
                message = "Invalid API key"
            elif status_code == 429:
                message = "API rate limit exceeded"
            elif status_code >= 500:
                message = "Server error from API provider"
                
            return jsonify({'error': message}), status_code
        
        return jsonify({'error': 'Failed to fetch data from API'}), 500
    
    def handle_generic_error(self, error):
        logger.error(f"Unexpected error: {str(error)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500
