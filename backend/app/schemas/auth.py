"""
Sakhi Authentication Request and Response Schemas.

Defines Pydantic models for user registration, credential verification (login),
token responses, token refreshes, and current user retrieval.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator
from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    """Credentials payload for member authentication."""
    mobile: Optional[str] = Field(default=None, description="10-digit mobile number")
    phone_number: Optional[str] = Field(default=None, description="Alternate field for mobile number")
    password: str = Field(..., min_length=1, max_length=100, description="Member account password")

    @field_validator("mobile", mode="before")
    @classmethod
    def clean_mobile(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            # Strip non-digits and leading country codes (+91)
            digits = "".join(filter(str.isdigit, str(v)))
            if digits.startswith("91") and len(digits) > 10:
                digits = digits[2:]
            return digits
        return v

    def get_phone(self) -> str:
        """Resolve either mobile or phone_number."""
        val = self.mobile or self.phone_number or ""
        digits = "".join(filter(str.isdigit, str(val)))
        if digits.startswith("91") and len(digits) > 10:
            digits = digits[2:]
        return digits


class RegisterRequest(BaseModel):
    """Payload for registering a new member account with credentials."""
    name: str = Field(..., min_length=2, max_length=100, description="Full name of member")
    mobile: Optional[str] = Field(default=None, description="10-digit mobile number")
    phone_number: Optional[str] = Field(default=None, description="Alternate field for mobile number")
    password: str = Field(..., min_length=6, max_length=100, description="Account password (min 6 characters)")
    
    # Demographics & Preferences
    age: int = Field(default=28, ge=18, le=100, description="Age in years")
    gender: str = Field(default="female", description="Gender identity")
    state: str = Field(default="Telangana", max_length=100, description="State of residence")
    district: Optional[str] = Field(default=None, max_length=100, description="District name")
    locality_type: str = Field(default="rural", description="'rural' or 'urban'")
    primary_language: str = Field(default="te", max_length=10, description="Preferred language code ('te', 'hi', 'en')")
    
    # SHG & Livelihood Attributes
    is_shg_member: bool = Field(default=True, description="Self-Help Group membership status")
    shg_name: Optional[str] = Field(default="Gayatri Mahila Sangham", max_length=150, description="SHG group name")
    occupation: Optional[str] = Field(default="Tailoring", max_length=100, description="Primary livelihood / trade")
    
    # Baseline Financial Snapshot (INR)
    monthly_income: float = Field(default=18500.0, ge=0.0, description="Baseline monthly household income")
    monthly_expenses: float = Field(default=14300.0, ge=0.0, description="Baseline monthly household expenses")
    initial_savings: float = Field(default=18000.0, ge=0.0, description="Existing liquid savings balance")
    initial_debt: float = Field(default=12000.0, ge=0.0, description="Existing outstanding debt")

    def get_phone(self) -> str:
        """Resolve either mobile or phone_number."""
        val = self.mobile or self.phone_number or ""
        digits = "".join(filter(str.isdigit, str(val)))
        if digits.startswith("91") and len(digits) > 10:
            digits = digits[2:]
        return digits


class TokenResponse(BaseModel):
    """JWT Token response issued upon successful registration or authentication."""
    access_token: str = Field(..., description="Signed JWT access token")
    refresh_token: Optional[str] = Field(default=None, description="Signed JWT refresh token")
    token_type: str = Field(default="bearer", description="Token schema type")
    expires_in: int = Field(..., description="Access token expiration window in seconds")
    user: UserResponse = Field(..., description="Authenticated user profile snapshot")


class RefreshTokenRequest(BaseModel):
    """Payload to request a new access token via refresh token."""
    refresh_token: str = Field(..., description="Valid refresh token")


class RefreshTokenResponse(BaseModel):
    """Response containing renewed access token."""
    access_token: str = Field(..., description="New signed JWT access token")
    token_type: str = Field(default="bearer", description="Token schema type")
    expires_in: int = Field(..., description="Access token expiration window in seconds")


class LogoutResponse(BaseModel):
    """Logout confirmation response."""
    message: str = Field(default="Logged out successfully", description="Status message")
