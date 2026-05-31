"""
Input Sanitizer Utility.

Purpose:
Cleanses and sanitizes untrusted citizen input before it hits the database or LLM.
Strips malicious HTML tags, JavaScript payloads, and dangerous characters.

Threats Mitigated:
- Cross-Site Scripting (XSS): Stored and Reflected.
- HTML/JavaScript Injection.
- Basic SQL Injection patterns (defense-in-depth, primary defense is SQLAlchemy).
"""

import re
import html

class InputSanitizer:
    """
    Utility class for sanitizing text inputs.
    """

    # Regex to match script tags, javascript: links, and common event handlers (onload, onerror)
    XSS_REGEX = re.compile(
        r'(<script.*?>.*?</script>)|(javascript:)|(on\w+\s*=)', 
        re.IGNORECASE | re.DOTALL
    )

    # Regex to match basic HTML tags to strip them completely
    HTML_TAG_REGEX = re.compile(r'<[^>]*>')

    @classmethod
    def sanitize_text(cls, text: str) -> str:
        """
        Sanitizes a plain text string.
        1. Strips explicit XSS vectors.
        2. Strips all HTML tags.
        3. Escapes remaining HTML characters (e.g., < to &lt;).
        """
        if not text:
            return text

        # 1. Remove dangerous XSS patterns
        sanitized = cls.XSS_REGEX.sub('', text)
        
        # 2. Remove all HTML tags
        sanitized = cls.HTML_TAG_REGEX.sub('', sanitized)
        
        # 3. Escape HTML entities (converts remaining <, >, &, " to safe entities)
        sanitized = html.escape(sanitized, quote=True)
        
        return sanitized.strip()

    @classmethod
    def sanitize_phone_number(cls, phone: str) -> str:
        """
        Ensures a phone number contains ONLY digits. 
        Strips any injection characters.
        """
        if not phone:
            return phone
        
        # Keep only digits
        return re.sub(r'\D', '', phone)

    @classmethod
    def sanitize_pincode(cls, pincode: str) -> str:
        """
        Ensures a pincode contains ONLY digits.
        """
        if not pincode:
            return pincode
            
        return re.sub(r'\D', '', pincode)
