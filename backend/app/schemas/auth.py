from pydantic import BaseModel, Field, model_validator
from typing import Optional
from app.schemas.user import UserResponse

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    email: Optional[str] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=20)
    
    # Demographic / Financial onboarding defaults
    age: int = Field(default=25, ge=1, le=120)
    state: str = Field(default="Telangana", min_length=1, max_length=100)
    gender: str = Field(default="women")
    is_shg_member: bool = Field(default=False)
    has_business_interest: bool = Field(default=False)
    is_rural: bool = Field(default=True)
    occupation: Optional[str] = None
    monthly_income: float = Field(default=0.0, ge=0.0)
    monthly_expenses: float = Field(default=0.0, ge=0.0)
    savings: float = Field(default=0.0, ge=0.0)
    debt: float = Field(default=0.0, ge=0.0)
    financial_goal: Optional[str] = None

    @model_validator(mode="after")
    def check_identifier(self):
        if not self.email and not self.phone:
            raise ValueError("At least one identifier (email or phone number) must be provided for registration.")
        return self

class LoginRequest(BaseModel):
    identifier: str = Field(..., min_length=1, description="Email or phone number")
    password: str = Field(..., min_length=1)

class RefreshRequest(BaseModel):
    refresh_token: str = Field(..., min_length=1)

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class TokenRefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class LogoutRequest(BaseModel):
    refresh_token: Optional[str] = None

class MessageResponse(BaseModel):
    message: str
