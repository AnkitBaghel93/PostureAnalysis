from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://xtylishab000:OIDVGA8oqB3Ad05J@cluster0.vagt6xv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB_NAME = os.getenv("DB_NAME", "correctposture")
