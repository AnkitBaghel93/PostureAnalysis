CorrectPosture – AI-Powered Posture Analysis App

Frontend:
- React
- Axios
- Tailwind CSS
- React Router

Frontend Setup 

cd frontend

npm install

Make sure in your axios requests you're using:http://127.0.0.1:9000 

npm start

Backend:
- FastAPI
- Uvicorn
- MongoDB (via Atlas)
- MediaPipe + OpenCV
- JWT Auth (using python-jose)


 Prerequisites

- Python 3.10+
- Node.js (v16+ recommended)
- MongoDB Atlas account

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt


run command for backend: uvicorn app.main:app --host 127.0.0.1 --port 9000 --reload


backend Dependencies : 

fastapi
uvicorn
pymongo
python-dotenv
passlib[bcrypt]
pydantic[email]
opencv-python-headless
mediapipe
numpy
python-multipart
python-jose
requests
jinja2


optional : Live Deployment

Frontend: https://postureanalysis-frontend.onrender.com

Backend: https://postureanalysis-backend.onrender.com
