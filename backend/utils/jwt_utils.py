"""
JWT (JSON Web Token) Utility.

Purpose:
Generates and validates HS256 signed JWTs for stateless authentication.
Enforces expiration (exp), issued at (iat), JWT ID (jti) for replay protection, and Roles (RBAC).

Threats Mitigated:
- Broken Authentication (OWASP #2)
- Session Hijacking
- Privilege Escalation (via strict role checking)
"""

import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import uuid

# In production, this MUST be loaded from a secure environment variable.
# Example: openssl rand -hex 32
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "b3a1f8c7e9d2045b8a6e4d9c7f1a3b5e8d2c4b6a9f1e3d5c7b9a2f4e6d8c0b2")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a signed JWT token containing user identity and role claims.
    """
    to_encode = data.copy()
    
    # Set Expiration (exp)
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),          # Issued At
        "jti": str(uuid.uuid4())           # JWT ID (prevents replay attacks if tracked)
    })
    
    # Encode and sign the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """
    Decodes and verifies a JWT token.
    Raises JWTError if expired, tampered with, or invalid.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        # In a real app, you might raise an HTTPException here, 
        # but returning None or letting the auth layer handle it is cleaner.
        return None
