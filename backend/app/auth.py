from fastapi import HTTPException,  Response
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from app.models import UserSignup, UserSignin
from app.database import users_collection
import os




load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

# Secret & Algorithm for JWT
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY not found in environment variables")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Helper functions ---

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def check_user_exists(email: str):
    return users_collection.find_one({"email": email})

def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# --- Signup logic ---
def create_user(user: UserSignup):
    if check_user_exists(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)
    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed
    })

    return {"message": "User registered successfully"}


# --- Signin logic ---
def login_user(user: UserSignin):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": db_user["email"]})

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "name": db_user["name"],
            "email": db_user["email"]
        }
    }


def logout_user(response: Response):
    # If in future you set tokens in cookies:
    response.delete_cookie("access_token")  
    return {"message": "Logout successful"}