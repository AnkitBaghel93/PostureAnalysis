from pydantic import BaseModel, EmailStr, Field

class UserSignup(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=5)


class UserSignin(BaseModel):
    email: EmailStr
    password: str