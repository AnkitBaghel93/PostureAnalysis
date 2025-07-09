from fastapi import FastAPI, File, UploadFile, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.detector import analyze_video
from app.models import UserSignup, UserSignin
from app.auth import create_user, login_user, logout_user
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/signup")
def signup(user: UserSignup):
    return create_user(user)

@app.post("/api/signin")
def signin(user: UserSignin):
    return login_user(user)

@app.post("/api/logout")
def logout(response: Response):
    return logout_user(response)

@app.get("/")
def home():
    return {"message": "Posture detection backend is running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    result = analyze_video(file.file)
    return {
        "results": result["results"],          
        "video_path": result["video_path"]      
    }


@app.get("/processed-video")
def get_video(path: str = Query(...)):
    if os.path.exists(path):
        return FileResponse(path, media_type="video/webm", filename="posture_output.webm")
    return {"error": "File not found"}
