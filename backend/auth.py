"""
FastAPI Authentication Dependencies & Endpoints.

Purpose:
Provides the OAuth2 password bearer flow for login and dependency injection
functions to enforce Role-Based Access Control (RBAC) on protected endpoints.

Threats Mitigated:
- Broken Access Control (OWASP #1)
- IDOR (Insecure Direct Object Reference)
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from utils.jwt_utils import decode_access_token

# This specifies the URL where clients send their username/password to get a token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    """
    Dependency that extracts and validates the JWT token from the Authorization header.
    Returns the decoded payload (claims) if valid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
        
    return payload

def require_role(required_role: str):
    """
    Dependency generator for enforcing strict Role-Based Access Control (RBAC).
    Usage: @app.get("/admin", dependencies=[Depends(require_role("admin"))])
    """
    def role_checker(current_user: Annotated[dict, Depends(get_current_user)]):
        user_role = current_user.get("role")
        if user_role != required_role and user_role != "admin": # Admins can access anything
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Requires role: {required_role}"
            )
        return current_user
    return role_checker

def require_admin(current_user: Annotated[dict, Depends(get_current_user)]):
    """
    Shorthand dependency for requiring admin privileges.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required."
        )
    return current_user
