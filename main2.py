import os
import time
import json
import cv2
import numpy as np
from datetime import datetime, date
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
import cloudinary
import cloudinary.uploader
import io
from PIL import Image
import face_recognition
from sklearn.metrics.pairwise import cosine_similarity

# Load environment variables
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET")
)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
client = MongoClient(os.getenv("MONGO_URL"))
db = client["dashdetection"]
visitor_collection = db["vis"]

# Memory
known_encodings = []
current_date = date.today()
CAMERA_SOURCE = None
RETRY_LIMIT = 5
cap = None

def try_open_camera(source):
    global cap
    if cap and cap.isOpened():
        cap.release()

    for attempt in range(RETRY_LIMIT):
        cap = cv2.VideoCapture(source)
        if cap.isOpened():
            print(f"✅ Connected to camera: {source}")
            return True
        print(f"🔁 Retrying... ({attempt+1}/{RETRY_LIMIT})")
        time.sleep(1)

    cap = None
    print("❌ Failed to connect after retries.")
    return False

@app.get("/", response_class=HTMLResponse)
async def index():
    return """
    <html>
        <head><title>Visitor Feed</title></head>
        <body style="text-align:center;background:#111;color:white;">
            <h1>Live Feed</h1>
            <img src="/video_feed" />
        </body>
    </html>
    """

def generate_frames():
    global current_date, known_encodings, cap, CAMERA_SOURCE

    while True:
        if not cap or not cap.isOpened():
            yield b'--frame\r\nContent-Type: text/plain\r\n\r\nPlease set a valid camera.\r\n\r\n'
            time.sleep(2)
            continue

        ret, frame = cap.read()
        if not ret:
            print("⚠️ Frame read failed.")
            if try_open_camera(CAMERA_SOURCE):
                continue
            else:
                yield b'--frame\r\nContent-Type: text/plain\r\n\r\nCamera disconnected. Please set again.\r\n\r\n'
                continue

        today = date.today()
        if today != current_date:
            known_encodings = []
            current_date = today

        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)

        for face_encoding, face_location in zip(face_encodings, face_locations):
            match = False
            for known in known_encodings:
                sim = cosine_similarity([face_encoding], [known])[0][0]
                if sim > 0.6:
                    match = True
                    break

            top, right, bottom, left = face_location

            if not match:
                known_encodings.append(face_encoding)
                face_img = frame[top:bottom, left:right]
                pil_img = Image.fromarray(cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB))
                buf = io.BytesIO()
                pil_img.save(buf, format="JPEG")
                buf.seek(0)

                image_url = None
                try:
                    upload_result = cloudinary.uploader.upload(
                        buf,
                        folder=f"visitors/{current_date}",
                        transformation=[{"width": 400, "height": 400, "crop": "limit"}, {"quality": "auto"}]
                    )
                    image_url = upload_result["secure_url"]
                except Exception as e:
                    print(f"❌ Cloudinary upload failed: {e}")

                visitor_collection.insert_one({
                    "imageUrl": image_url,
                    "timestamp": datetime.now(),
                    "status": "unknown",
                    "faceEncoding": face_encoding.tolist()
                })

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(frame, "New Visitor", (left, top-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            else:
                cv2.rectangle(frame, (left, top), (right, bottom), (255, 255, 0), 2)
                cv2.putText(frame, "Known Visitor", (left, top-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'

@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type='multipart/x-mixed-replace; boundary=frame')

@app.post("/set_camera")
def set_camera(camera_url: str = Body(..., embed=True)):
    global CAMERA_SOURCE
    CAMERA_SOURCE = camera_url
    if try_open_camera(CAMERA_SOURCE):
        return {"message": f"Camera set to {CAMERA_SOURCE}"}
    else:
        return {"message": "Failed to connect to camera, please check URL"}

class StatusUpdate(BaseModel):
    status: str

@app.get("/visitor_logs")
def get_visitor_logs(status: str = None):
    query = {"status": status} if status else {}
    visitors = list(visitor_collection.find(query).sort("timestamp", -1))
    for v in visitors:
        v["_id"] = str(v["_id"])
    return visitors

@app.patch("/visitor_logs/{visitor_id}")
async def review_visitor(visitor_id: str, update: StatusUpdate):
    obj_id = ObjectId(visitor_id)
    if update.status not in ["known", "unknown", "reviewed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = visitor_collection.update_one({"_id": obj_id}, {"$set": {"status": update.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return {"message": "Status updated"}

@app.post("/reset_encodings")
def reset_encodings_only():
    global known_encodings, current_date
    known_encodings = []
    current_date = date.today()
    return {"message": "Encodings reset"}
