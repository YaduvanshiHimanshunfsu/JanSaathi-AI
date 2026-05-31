"""
Security Middleware Configuration.

Purpose: 
Protects the application against Denial of Service (DoS), Cross-Site Scripting (XSS), 
Clickjacking, and MIME-sniffing attacks at the network/HTTP layer before traffic 
hits the application routing logic.

Threats Mitigated:
- RateLimitMiddleware: Mitigates API Abuse, DoS, and Brute Force attacks.
- SecurityHeadersMiddleware: Mitigates XSS, Clickjacking, and Information Disclosure.
"""

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI

# ---------------------------------------------------------
# 1. Rate Limiter Configuration (Anti-DoS & API Abuse)
# ---------------------------------------------------------
# Uses the client's IP address (get_remote_address) to track usage.
limiter = Limiter(key_func=get_remote_address)

def setup_rate_limiting(app: FastAPI):
    """
    Attaches the rate limiter to the FastAPI application.
    """
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ---------------------------------------------------------
# 2. Security Headers Middleware (OWASP Secure Defaults)
# ---------------------------------------------------------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Injects critical security headers into every HTTP response.
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # 1. Content Security Policy (CSP): Prevents XSS by restricting source of scripts.
        # Only allow scripts from 'self' (the origin).
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; object-src 'none';"
        
        # 2. X-Frame-Options: Prevents Clickjacking by disallowing embedding in iframes.
        response.headers["X-Frame-Options"] = "DENY"
        
        # 3. X-Content-Type-Options: Prevents MIME-sniffing vulnerabilities.
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # 4. Referrer-Policy: Prevents leaking origin URLs to third parties.
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # 5. Strict-Transport-Security (HSTS): Forces HTTPS (Use in production).
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # 6. Cache-Control: Prevents sensitive authenticated data from being cached on shared routers.
        # Note: In production, apply this selectively to authenticated routes.
        response.headers["Cache-Control"] = "no-store, max-age=0"
        
        return response
