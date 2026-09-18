import bcrypt
import logging

logger = logging.getLogger("sakhi.security")

def hash_password(plain_password: str) -> str:
    """
    Securely hashes a plaintext password using bcrypt with salt.
    Never stores or logs the plaintext password.
    """
    if not plain_password:
        raise ValueError("Password cannot be empty")
    password_bytes = plain_password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plaintext password against a stored bcrypt hash.
    Safe against timing attacks.
    """
    if not plain_password or not hashed_password:
        return False
    try:
        password_bytes = plain_password.encode("utf-8")
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception as e:
        logger.warning(f"Password verification error: {e}")
        return False
