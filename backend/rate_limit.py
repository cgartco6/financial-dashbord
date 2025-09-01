from datetime import datetime, timedelta
import redis
import os

class RateLimiter:
    def __init__(self, max_requests=100, time_window=3600):
        self.max_requests = max_requests
        self.time_window = time_window
        
        # Use Redis for distributed rate limiting in production
        redis_host = os.getenv('REDIS_HOST', 'localhost')
        redis_port = int(os.getenv('REDIS_PORT', 6379))
        
        try:
            self.redis_client = redis.Redis(host=redis_host, port=redis_port, db=0)
            self.redis_client.ping()  # Test connection
        except redis.ConnectionError:
            self.redis_client = None
            self.local_requests = {}
    
    def is_allowed(self, client_ip):
        if self.redis_client:
            # Use Redis for rate limiting
            key = f"rate_limit:{client_ip}"
            current = self.redis_client.get(key)
            
            if current:
                current = int(current)
                if current >= self.max_requests:
                    return False
                self.redis_client.incr(key)
            else:
                self.redis_client.setex(key, self.time_window, 1)
            
            return True
        else:
            # Fallback to local rate limiting
            now = datetime.now()
            if client_ip not in self.local_requests:
                self.local_requests[client_ip] = {
                    'count': 1,
                    'window_start': now
                }
                return True
            
            request_data = self.local_requests[client_ip]
            
            # Reset window if it has expired
            if now - request_data['window_start'] > timedelta(seconds=self.time_window):
                request_data['count'] = 1
                request_data['window_start'] = now
                return True
            
            # Check if limit exceeded
            if request_data['count'] >= self.max_requests:
                return False
            
            # Increment count
            request_data['count'] += 1
            return True
