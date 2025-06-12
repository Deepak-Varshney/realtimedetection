
import os
import time
import json
import cv2
import numpy as np
from datetime import datetime, date
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
import face_recognition
from pymongo import MongoClient
from bson import ObjectId, json_util
from pydantic import BaseModel
import cloudinary
import cloudinary.uploader
import io
from PIL import Image
# Configure using your Cloudinary credentials
cloudinary.config(
    cloud_name="dshog03l1",
    api_key="255181171571231",
    api_secret="evJHkMcNfmO3v5XpAIDkJtffz0A"
)

class StatusUpdate(BaseModel):
    status: str


# FastAPI setup
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# MongoDB setup
client = MongoClient("mongodb+srv://deepakvarshneycom:ijBPV8hWJqdGMolr@cluster0.qllt4ki.mongodb.net/dashdetection")

db = client["dashdetection"]
visitor_collection = db["vis"]

# YOLOv8 model
model = YOLO("yolov8n.pt")

# Memory
known_encodings = []
current_date = date.today()

# Camera
CAMERA_SOURCE = "http://213.3.30.80:6001/axis-cgi/mjpg/video.cgi"
cap = cv2.VideoCapture(CAMERA_SOURCE)
while not cap.isOpened():
    print("🔁 Retrying camera connection...")
    cap.open(CAMERA_SOURCE)
    time.sleep(5)


def try_open_camera(source):
    global cap
    if cap and cap.isOpened():
        cap.release()
    cap = cv2.VideoCapture(source)
    for _ in range(10):
        if cap.isOpened():
            print(f"✅ Connected to camera: {source}")
            return True
        print("🔁 Retrying camera connection...")
        time.sleep(1)
    print("❌ Failed to connect to camera.")
    return False

@app.get("/", response_class=HTMLResponse)
async def index():
    return """
    <html>
        <head>
            <title>Visitor Camera</title>
            <style>
                body { text-align: center; background: #111; color: #fff; }
                img { width: 100%; max-width: 600px; border: 3px solid #ccc; border-radius: 10px; }
            </style>
        </head>
        <body>
            <h2>Live Visitor Feed</h2>
            <img src="/video_feed" />
        </body>
    </html>
    """
def generate_frames():
    global current_date, known_encodings
    frame_count = 0
    frame_skip = 5
    max_encodings = 500

    while True:
        ret, frame = cap.read()

        frame_count += 1
        height, width = frame.shape[:2]

        if frame_count % frame_skip != 0:
            _, buffer = cv2.imencode('.jpg', frame)
            yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
            continue

        today = date.today()
        if today != current_date:
            current_date = today
            known_encodings = []

        resized = cv2.resize(frame, (640, 480))
        scale_x, scale_y = width / 640, height / 480

        results = model.predict(resized, conf=0.5, verbose=False)

        for result in results:
            for box in result.boxes:
                if int(box.cls[0]) != 0:
                    continue

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                x1, y1 = int(x1 * scale_x), int(y1 * scale_y)
                x2, y2 = int(x2 * scale_x), int(y2 * scale_y)

                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(width, x2), min(height, y2)

                face_frame = frame[y1:y2, x1:x2]
                if face_frame.size == 0:
                    continue

                face_rgb = cv2.cvtColor(face_frame, cv2.COLOR_BGR2RGB)
                face_locations = face_recognition.face_locations(face_rgb)
                encodings = face_recognition.face_encodings(face_rgb, face_locations)

                for encoding in encodings:
                    matches = face_recognition.compare_faces(known_encodings, encoding, tolerance=0.6)
                    if not any(matches):
                        known_encodings.append(encoding)
                        if len(known_encodings) > max_encodings:
                            known_encodings.pop(0)
                
                        # Convert BGR to RGB
                        pil_image = Image.fromarray(cv2.cvtColor(face_frame, cv2.COLOR_BGR2RGB))

                        # Save to in-memory buffer
                        buffer = io.BytesIO()
                        pil_image.save(buffer, format="JPEG")
                        buffer.seek(0)

                        # Upload to Cloudinary
                        upload_result = cloudinary.uploader.upload(
                            buffer,
                            folder=f"visitors/{current_date.strftime('%Y-%m-%d')}",
                            transformation=[
                                {"width": 400, "height": 400, "crop": "limit"},
                                {"quality": "auto"}
                            ]
                        )


                        image_url = upload_result["secure_url"]

                        visitor_collection.insert_one({
                            "imageUrl": image_url,
                            "timestamp": datetime.now(),
                            "status": "unknown",
                            "faceEncoding": encoding.tolist()
                        })


                        print(f"🔍 New visitor logged: {image_url}")
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(frame, "New Visitor", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                    else:
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 255, 0), 2)
                        cv2.putText(frame, "Known Visitor", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'


@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type='multipart/x-mixed-replace; boundary=frame')


@app.get("/visitor_logs")
def get_visitor_logs(status: str = None, start_date: str = None, end_date: str = None):
    query = {}

    if status:
        query["status"] = status

    if start_date or end_date:
        query["timestamp"] = {}
        if start_date:
            query["timestamp"]["$gte"] = datetime.strptime(start_date, "%Y-%m-%d")
        if end_date:
            query["timestamp"]["$lte"] = datetime.strptime(end_date, "%Y-%m-%d")

    visitors = list(visitor_collection.find(query).sort("timestamp", -1))

    # ✅ Convert _id to string
    for v in visitors:
        v["_id"] = str(v["_id"])

    return visitors  # FastAPI will auto-JSON this cleanly

@app.get("/live_logs")
def get_latest_logs():
    visitors = list(visitor_collection.find().sort("timestamp", -1).limit(10))
    for v in visitors:
        v["_id"] = str(v["_id"])
    return visitors


@app.delete("/visitor_logs/{visitor_id}")
async def delete_visitor(visitor_id: str):
    try:
        obj_id = ObjectId(visitor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid visitor ID")

    result = visitor_collection.delete_one({"_id": obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    return {"message": "Visitor deleted successfully"}


@app.delete("/visitor_logs/today")
async def delete_todays_visitors():
    start = datetime.combine(date.today(), datetime.min.time())
    end = datetime.combine(date.today(), datetime.max.time())

    result = visitor_collection.delete_many({
        "timestamp": {"$gte": start, "$lte": end}
    })

    return {"message": f"{result.deleted_count} visitor(s) deleted for today"}

@app.patch("/visitor_logs/{visitor_id}")
async def review_visitor(visitor_id: str, update: StatusUpdate):
    try:
        obj_id = ObjectId(visitor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid visitor ID")

    if update.status not in ["known", "unknown", "reviewed"]:
        raise HTTPException(status_code=400, detail="Invalid status. Use 'known', 'unknown', or 'reviewed'.")

    result = visitor_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": update.status}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Visitor not found")

    return {"message": "Visitor status updated successfully"}

@app.post("/reset_encodings")
def reset_encodings_only():
    global known_encodings, current_date
    known_encodings = []
    current_date = date.today()
    return {"message": "In-memory face encodings reset for today"}


@app.post("/set_camera")
def set_camera(camera_url: str = Body(..., embed=True)):
    global CAMERA_SOURCE
    CAMERA_SOURCE = camera_url
    success = try_open_camera(CAMERA_SOURCE)
    if success:
        return {"message": f"Camera changed to {CAMERA_SOURCE}"}
    else:
        raise HTTPException(status_code=400, detail="Failed to connect to new camera source")


@app.on_event("shutdown")
def shutdown_event():
    cap.release()
