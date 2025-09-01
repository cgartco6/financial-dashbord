import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # API configuration
    CMC_API_KEY = os.getenv('CMC_API_KEY')
    
    # Rate limiting configuration
    RATE_LIMIT_MAX_REQUESTS = int(os.getenv('RATE_LIMIT_MAX_REQUESTS', 100))
    RATE_LIMIT_TIME_WINDOW = int(os.getenv('RATE_LIMIT_TIME_WINDOW', 3600))
    
    # Cache configuration
    CACHE_DURATION = int(os.getenv('CACHE_DURATION', 60))
    
    # Security configuration
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5000').split(',')
