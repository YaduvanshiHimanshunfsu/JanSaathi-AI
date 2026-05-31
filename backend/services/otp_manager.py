"""
Secure OTP (One-Time Password) Manager.

Purpose:
Handles the cryptographic generation, hashing, and verification of OTPs.
Never store OTPs in plaintext. They are equivalent to temporary passwords.

Threats Mitigated:
- Brute Force Attacks
- Replay Attacks
- OTP Prediction (using CSPRNG)
- Database Breach Exposure (OTPs are hashed)
"""

import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Tuple

# Mock in-memory store for OTPs (In production, use Redis with TTL)
# Format: phone_number -> (hashed_otp, expires_at, attempts)
_otp_store: Dict[str, Tuple[str, datetime, int]] = {}

MAX_ATTEMPTS = 3
OTP_TTL_MINUTES = 5

class OTPManager:
    """
    Manages the lifecycle of a secure OTP.
    """

    @staticmethod
    def _hash_otp(otp: str) -> str:
        """Hashes the OTP using SHA256 for secure storage."""
        return hashlib.sha256(otp.encode()).hexdigest()

    @classmethod
    def generate_otp(cls, phone_number: str) -> str:
        """
        Generates a 6-digit cryptographically secure OTP and stores its hash.
        """
        # 1. Cryptographically secure random number generation (CSPRNG)
        # secrets module is safe for generating passwords/tokens.
        otp = "".join(str(secrets.randbelow(10)) for _ in range(6))
        
        # 2. Hash the OTP for storage
        hashed_otp = cls._hash_otp(otp)
        
        # 3. Calculate Expiration (TTL)
        expires_at = datetime.utcnow() + timedelta(minutes=OTP_TTL_MINUTES)
        
        # 4. Store (Hash, Expiry, 0 attempts)
        _otp_store[phone_number] = (hashed_otp, expires_at, 0)
        
        # We return the plaintext OTP *once* so it can be sent via SMS
        return otp

    @classmethod
    def verify_otp(cls, phone_number: str, provided_otp: str) -> bool:
        """
        Verifies a provided OTP against the stored hash.
        Includes TTL checks, brute-force locking, and replay prevention.
        """
        if phone_number not in _otp_store:
            return False
            
        hashed_otp, expires_at, attempts = _otp_store[phone_number]
        
        # 1. Check TTL (Expiration)
        if datetime.utcnow() > expires_at:
            del _otp_store[phone_number] # Clean up
            return False
            
        # 2. Check Brute-Force Limits
        if attempts >= MAX_ATTEMPTS:
            # Lockout mechanism (in reality, track this in a DB/Redis)
            return False
            
        # 3. Verify Hash
        provided_hash = cls._hash_otp(provided_otp)
        if secrets.compare_digest(provided_hash, hashed_otp):
            # 4. Success -> Replay Prevention (Delete OTP immediately after use)
            del _otp_store[phone_number]
            return True
            
        # Failure -> Increment attempt counter
        _otp_store[phone_number] = (hashed_otp, expires_at, attempts + 1)
        return False
