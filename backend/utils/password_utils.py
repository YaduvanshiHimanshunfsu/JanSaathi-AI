"""
Password Hashing Utility.

Purpose:
Securely hashes and verifies passwords using bcrypt (with salt).
Never use SHA256 or MD5 for passwords due to rainbow table and fast-compute vulnerabilities.

Threats Mitigated:
- Password Cracking (Offline).
- Rainbow Table Attacks.
"""

from passlib.context import CryptContext

# Define the bcrypt hashing context
# Deprecated argument "deprecated='auto'" removed for modern passlib versions if preferred,
# but it's standard for smooth upgrades.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plaintext password against the stored bcrypt hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Generates a bcrypt hash (automatically salted) for a plaintext password.
    """
    return pwd_context.hash(password)
