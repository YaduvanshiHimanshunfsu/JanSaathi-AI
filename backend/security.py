import os
import re
import json
import uuid
import time
import secrets
import hashlib
import logging
import html
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timezone, timedelta

import jwt
from fastapi import Request, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

try:
    from security_metrics import metrics
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from security_metrics import metrics

# --- 2G. AUDIT LOGGER ---
audit_logger = logging.getLogger("sunwai.audit")
audit_logger.setLevel(logging.INFO)
log_path = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(log_path, exist_ok=True)
audit_fh = logging.FileHandler(os.path.join(log_path, "sunwai_audit.log"))
audit_fh.setFormatter(logging.Formatter('%(message)s'))
audit_logger.addHandler(audit_fh)

# --- 2F. PII MASKER ---
def mask_ip(ip: str) -> str:
    if not ip: return "unknown"
    parts = ip.split('.')
    if len(parts) == 4:
        parts[-1] = "***"
        return ".".join(parts)
    parts_v6 = ip.split(':')
    if len(parts_v6) > 1:
        parts_v6[-1] = "****"
        return ":".join(parts_v6)
    return ip

def mask_mobile(mobile: str) -> str:
    if not mobile or len(mobile) < 4: return mobile
    return "XXXXXX" + mobile[-4:]

def mask_name(name: str) -> str:
    if not name: return ""
    words = name.split()
    masked_words = []
    for w in words:
        if len(w) <= 2:
            masked_words.append(w)
        else:
            masked_words.append(w[0] + "*" * (len(w)-2) + w[-1])
    return " ".join(masked_words)

def log_action(action: str, request: Request, extra_dict: Dict[str, Any] = None):
    ip = request.client.host if request.client else "unknown"
    path = request.url.path
    method = request.method
    
    masked_extra = {}
    if extra_dict:
        for k, v in extra_dict.items():
            if k == "mobile": masked_extra[k] = mask_mobile(str(v))
            elif k == "name": masked_extra[k] = mask_name(str(v))
            elif k == "ip": masked_extra[k] = mask_ip(str(v))
            else: masked_extra[k] = v

    log_entry = f"{datetime.now(timezone.utc).isoformat()} | INFO | ACTION={action} | IP={mask_ip(ip)} | PATH={path} | METHOD={method} | EXTRAS={json.dumps(masked_extra)}"
    audit_logger.info(log_entry)


# --- 2A. JWT OFFICER AUTHENTICATION ---
security_bearer = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    # Will warn, but allow to proceed (as requested by specs: "warn if using default")
    JWT_SECRET = "REPLACE_WITH_64_CHAR_RANDOM_HEX"

if JWT_SECRET == "REPLACE_WITH_64_CHAR_RANDOM_HEX":
    print("WARNING: Using default JWT_SECRET. This is insecure.")

JWT_EXPIRY_MINUTES = int(os.getenv("JWT_EXPIRY_MINUTES", "60"))

def get_officer_from_request(credentials: HTTPAuthorizationCredentials = Security(security_bearer)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def create_jwt_token(username: str, role: str) -> str:
    payload = {
        "sub": username,
        "role": role,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRY_MINUTES),
        "jti": str(uuid.uuid4())
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

OFFICER_DB = {
    "admin": {"role": "admin", "hash": hashlib.sha256(os.getenv("ADMIN_PASSWORD", "SunwAI@Admin2026!").encode()).hexdigest()},
    "officer1": {"role": "officer", "hash": hashlib.sha256(os.getenv("OFFICER1_PASSWORD", "LNN@Officer#1").encode()).hexdigest()},
    "officer2": {"role": "officer", "hash": hashlib.sha256(os.getenv("OFFICER2_PASSWORD", "LNN@Officer#2").encode()).hexdigest()}
}

# --- 2B. BRUTE FORCE LOCKOUT ---
class LoginGuard:
    def __init__(self):
        self.failed_attempts = {}
        
    def check_and_record_failure(self, ip: str) -> int:
        now = time.time()
        self.failed_attempts[ip] = [ts for ts in self.failed_attempts.get(ip, []) if now - ts < 600]
        
        if len(self.failed_attempts[ip]) >= 5:
            return 0
            
        self.failed_attempts[ip].append(now)
        metrics.increment("failed_logins")
        return 5 - len(self.failed_attempts[ip])
        
    def check_lockout(self, ip: str):
        now = time.time()
        attempts = [ts for ts in self.failed_attempts.get(ip, []) if now - ts < 600]
        if len(attempts) >= 5:
            lockout_expiry = attempts[4] + 300
            if now < lockout_expiry:
                raise HTTPException(status_code=429, detail=f"locked for {int(lockout_expiry - now)} more seconds")
            else:
                self.failed_attempts[ip] = []
                
    def reset_failures(self, ip: str):
        self.failed_attempts[ip] = []

login_guard = LoginGuard()

# --- 2C. RATE LIMITING MIDDLEWARE ---
class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.buckets = {}
        self.rules = {
            "/api/grievance/submit": 10,
            "/api/auth/login": 5,
            "/api/otp/generate": 3,
            "/api/otp/verify": 5,
            "global": 100
        }
        
    async def dispatch(self, request: Request, call_next):
        ip = request.client.host if request.client else "unknown"
        path = request.url.path
        
        limit = self.rules.get(path)
        if not limit and path.startswith("/api/"):
            limit = self.rules["global"]
            
        if limit:
            bucket_key = f"{ip}_{path}"
            now = time.time()
            tokens, last_refill = self.buckets.get(bucket_key, (limit, now))
            
            tokens_to_add = ((now - last_refill) / 60.0) * limit
            tokens = min(limit, tokens + tokens_to_add)
            
            if tokens < 1:
                metrics.increment("rate_limit_violations")
                log_action("RATE_LIMIT_HIT", request)
                return JSONResponse(status_code=429, content={"detail": "Too Many Requests"}, headers={"Retry-After": "60"})
            
            self.buckets[bucket_key] = (tokens - 1, now)
            
        return await call_next(request)

# --- 2D. INPUT SANITIZER ---
DANGEROUS_PATTERNS = [
    r"<script.*?>.*?</script>",
    r"(?i)javascript:",
    r"(?i)on\w+\s*=",
    r"<iframe",
    r"eval\s*\(",
    r"document\.(cookie|location|write)",
    r"\{\{.*?\}\}",
    r"\\x[0-9a-fA-F]{2}",
    r"(?i)(union|select|insert|update|delete|drop)\s"
]

def sanitize_text(raw: str, max_length: int = 2000) -> str:
    if not raw: return ""
    text = html.escape(raw)
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, text, re.DOTALL):
            raise HTTPException(status_code=400, detail="Dangerous content detected")
    text = " ".join(text.split())
    return text[:max_length]

def sanitize_name(raw: str) -> str:
    if not raw: return ""
    if not re.match(r"^[\w\s\.\-'\u0900-\u097F]+$", raw):
        raise HTTPException(status_code=400, detail="Invalid characters in name")
    return raw[:100]

def sanitize_mobile(raw: str) -> str:
    digits = "".join(filter(str.isdigit, str(raw)))
    if not re.match(r"^[6-9]\d{9}$", digits):
        raise HTTPException(status_code=400, detail="Invalid mobile number format")
    return digits

def sanitize_pincode(raw: str) -> str:
    digits = "".join(filter(str.isdigit, str(raw)))
    if not re.match(r"^\d{6}$", digits):
        raise HTTPException(status_code=400, detail="Invalid pincode format")
    return digits

def validate_district(raw: str) -> str:
    valid_districts = ["Lucknow", "Kanpur", "Prayagraj", "Varanasi", "Gorakhpur", "Noida", "Ghaziabad", "Ayodhya", "other"]
    if raw not in valid_districts:
        raise HTTPException(status_code=400, detail="Invalid district")
    return raw

# --- 2E. SECURITY HEADERS MIDDLEWARE ---
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none';"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Server"] = "SunwAI-Portal"
        if request.url.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        return response

# --- 2H. OTP SYSTEM ---
OTP_STORE = {}

def generate_otp(mobile: str) -> str:
    otp = str(secrets.randbelow(1000000)).zfill(6)
    otp_hash = hashlib.sha256(otp.encode()).hexdigest()
    OTP_STORE[mobile] = {
        "hash": otp_hash,
        "expiry": time.time() + 300,
        "attempts": 0
    }
    return otp

def verify_otp(mobile: str, otp_input: str) -> bool:
    record = OTP_STORE.get(mobile)
    if not record:
        return False
    if time.time() > record["expiry"]:
        del OTP_STORE[mobile]
        return False
    record["attempts"] += 1
    if record["attempts"] > 3:
        del OTP_STORE[mobile]
        metrics.increment("otp_abuse_attempts")
        return False
        
    input_hash = hashlib.sha256(str(otp_input).encode()).hexdigest()
    if secrets.compare_digest(record["hash"], input_hash):
        del OTP_STORE[mobile]
        return True
    return False

# --- 2I. SECURE TICKET ID ---
def generate_secure_ticket_id() -> str:
    year = datetime.now().year
    rand_hex = secrets.token_hex(4).upper()
    return f"GRV-{year}-{rand_hex}"

# --- 2J. CORS HARDENING ---
def get_cors_origins() -> List[str]:
    origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:8000,http://127.0.0.1:8000,http://localhost:5500")
    return [o.strip() for o in origins_env.split(",")]
